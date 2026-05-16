'use client';

import React, {
  useRef, useState, useCallback, useMemo, useReducer, useEffect,
} from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Baseplate from './Baseplate';

// ─── LEGO physical constants (1 unit = 1 stud pitch = 8 mm) ──────────────────
export const STUD_PITCH  = 1.0;   // 8 mm
export const BRICK_H     = 1.2;   // 9.6 mm  (standard 3-plate brick)
export const PLATE_H     = 0.4;   // 3.2 mm
export const STUD_R      = 0.28;  // 2.4 mm radius (slightly undersized for gap)
export const STUD_HEIGHT = 0.22;  // 1.76 mm
export const BODY_GAP    = 0.06;  // clearance so neighbouring bricks show a seam
export const GRID_STUDS  = 32;    // 32×32 baseplate
export const GRID_HALF   = (GRID_STUDS - 1) / 2; // offset that centres grid at origin

// ─── Types ────────────────────────────────────────────────────────────────────
export interface LegoUnit {
  id: string;
  gx: number;       // top-left corner, integer stud column
  gz: number;       // top-left corner, integer stud row
  bottomY: number;  // world Y of bottom face
  width: number;    // studs (X direction)
  depth: number;    // studs (Z direction)
  brickH: number;   // BRICK_H or PLATE_H
  color: string;
}

// ─── Grid ↔ World helpers ─────────────────────────────────────────────────────
function gridToWorldCenter(gx: number, gz: number, w: number, d: number, bottomY: number, brickH: number) {
  return new THREE.Vector3(
    (gx + (w - 1) / 2 - GRID_HALF) * STUD_PITCH,
    bottomY + brickH / 2,
    (gz + (d - 1) / 2 - GRID_HALF) * STUD_PITCH,
  );
}

function worldToGridCorner(wx: number, wz: number, w: number, d: number): [number, number] {
  const gx = Math.round(wx / STUD_PITCH + GRID_HALF - (w - 1) / 2);
  const gz = Math.round(wz / STUD_PITCH + GRID_HALF - (d - 1) / 2);
  return [gx, gz];
}

function getStackHeight(bricks: LegoUnit[], gx: number, gz: number, w: number, d: number): number {
  let maxTop = 0;
  for (const b of bricks) {
    const xOk = Math.max(gx, b.gx) < Math.min(gx + w, b.gx + b.width);
    const zOk = Math.max(gz, b.gz) < Math.min(gz + d, b.gz + b.depth);
    if (xOk && zOk) maxTop = Math.max(maxTop, b.bottomY + b.brickH);
  }
  return maxTop;
}

function isOOB(gx: number, gz: number, w: number, d: number) {
  return gx < 0 || gz < 0 || gx + w > GRID_STUDS || gz + d > GRID_STUDS;
}

// ─── Undo / Redo reducer ──────────────────────────────────────────────────────
let uid = 0;
type Action =
  | { type: 'ADD'; data: Omit<LegoUnit, 'id'> }
  | { type: 'REMOVE'; id: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' };

interface BState { bricks: LegoUnit[]; past: LegoUnit[][]; future: LegoUnit[][] }

function bReducer(s: BState, a: Action): BState {
  switch (a.type) {
    case 'ADD': {
      const nb: LegoUnit = { ...a.data, id: `b${++uid}` };
      return { bricks: [...s.bricks, nb], past: [...s.past, s.bricks], future: [] };
    }
    case 'REMOVE': {
      return { bricks: s.bricks.filter(b => b.id !== a.id), past: [...s.past, s.bricks], future: [] };
    }
    case 'UNDO': {
      if (!s.past.length) return s;
      const prev = s.past[s.past.length - 1];
      return { bricks: prev, past: s.past.slice(0, -1), future: [s.bricks, ...s.future] };
    }
    case 'REDO': {
      if (!s.future.length) return s;
      return { bricks: s.future[0], past: [...s.past, s.bricks], future: s.future.slice(1) };
    }
    case 'RESET':
      return { bricks: [], past: [...s.past, s.bricks], future: [] };
    default: return s;
  }
}

// ─── Single brick mesh ────────────────────────────────────────────────────────
interface BrickMeshProps {
  brick: LegoUnit;
  selected: boolean;
  hovered: boolean;
  mode: 'place' | 'delete' | 'view';
  onPointerUp: (e: THREE.Event) => void;
  onEnter: () => void;
  onLeave: () => void;
}

const BrickMesh = React.memo(function BrickMesh({
  brick, selected, hovered, mode, onPointerUp, onEnter, onLeave,
}: BrickMeshProps) {
  const pos = useMemo(
    () => gridToWorldCenter(brick.gx, brick.gz, brick.width, brick.depth, brick.bottomY, brick.brickH),
    [brick.gx, brick.gz, brick.width, brick.depth, brick.bottomY, brick.brickH],
  );
  const bw = brick.width  * STUD_PITCH - BODY_GAP;
  const bd = brick.depth  * STUD_PITCH - BODY_GAP;
  const bh = brick.brickH;

  const col = useMemo(() => {
    if (hovered && mode === 'delete') return '#ff3333';
    if (selected) {
      const c = new THREE.Color(brick.color);
      c.offsetHSL(0, 0, 0.18);
      return `#${c.getHexString()}`;
    }
    return brick.color;
  }, [hovered, selected, mode, brick.color]);

  const studs = useMemo(() => {
    const out = [];
    for (let sx = 0; sx < brick.width; sx++) {
      for (let sz = 0; sz < brick.depth; sz++) {
        out.push([
          (sx - (brick.width  - 1) / 2) * STUD_PITCH,
          (sz - (brick.depth - 1) / 2) * STUD_PITCH,
        ]);
      }
    }
    return out;
  }, [brick.width, brick.depth]);

  return (
    <group position={pos}>
      {/* body */}
      <mesh
        castShadow receiveShadow
        onPointerUp={onPointerUp}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        userData={{ isBrick: true, brickId: brick.id, topY: pos.y + bh / 2 }}
      >
        <boxGeometry args={[bw, bh, bd]} />
        <meshStandardMaterial
          color={col} roughness={0.32} metalness={0.06}
          emissive={selected ? col : '#000'} emissiveIntensity={selected ? 0.18 : 0}
        />
      </mesh>
      {/* studs */}
      {studs.map(([sx, sz], i) => (
        <mesh key={i} position={[sx, bh / 2 + STUD_HEIGHT / 2, sz]} castShadow>
          <cylinderGeometry args={[STUD_R, STUD_R, STUD_HEIGHT, 16]} />
          <meshStandardMaterial color={col} roughness={0.28} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
});

// ─── Ghost brick (placement preview) ─────────────────────────────────────────
function GhostBrick({ gx, gz, w, d, brickH, color, valid }: {
  gx: number; gz: number; w: number; d: number; brickH: number; color: string; valid: boolean;
}) {
  const bottomY = 0; // ghost manages its own snap
  const pos = useMemo(
    () => gridToWorldCenter(gx, gz, w, d, bottomY, brickH),
    [gx, gz, w, d, bottomY, brickH],
  );
  const bw = w * STUD_PITCH - BODY_GAP;
  const bd = d * STUD_PITCH - BODY_GAP;
  const studs = useMemo(() => {
    const out = [];
    for (let sx = 0; sx < w; sx++)
      for (let sz = 0; sz < d; sz++)
        out.push([(sx - (w - 1) / 2) * STUD_PITCH, (sz - (d - 1) / 2) * STUD_PITCH]);
    return out;
  }, [w, d]);
  const c = valid ? color : '#ff2222';
  return (
    <group position={pos}>
      <mesh>
        <boxGeometry args={[bw, brickH, bd]} />
        <meshStandardMaterial color={c} transparent opacity={0.45} roughness={0.3} />
      </mesh>
      {studs.map(([sx, sz], i) => (
        <mesh key={i} position={[sx, brickH / 2 + STUD_HEIGHT / 2, sz]}>
          <cylinderGeometry args={[STUD_R, STUD_R, STUD_HEIGHT, 12]} />
          <meshStandardMaterial color={c} transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Invisible placement surface at variable Y ────────────────────────────────
function BuildSurface({ y, onMove, onCommit }: {
  y: number;
  onMove: (pt: THREE.Vector3) => void;
  onCommit: () => void;
}) {
  const size = GRID_STUDS * STUD_PITCH + 6;
  return (
    <mesh
      position={[0, y, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerMove={(e) => { e.stopPropagation(); onMove(e.point); }}
      onPointerUp={(e) => { e.stopPropagation(); onCommit(); }}
    >
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial visible={false} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

// ─── Interactive scene (inside Canvas) ───────────────────────────────────────
interface SceneProps {
  bricks: LegoUnit[];
  mode: 'place' | 'delete' | 'view';
  selW: number; selD: number; selH: number;
  color: string;
  onAdd: (data: Omit<LegoUnit, 'id'>) => void;
  onRemove: (id: string) => void;
}

function Scene({ bricks, mode, selW, selD, selH, color, onAdd, onRemove }: SceneProps) {
  const { gl } = useThree();
  const orbitRef = useRef<any>(null);

  const [ghost, setGhost] = useState<{ gx: number; gz: number; bottomY: number; valid: boolean } | null>(null);
  const [surfaceY, setSurfaceY] = useState(0.005);
  const [hovId, setHovId] = useState<string | null>(null);
  const [selId, setSelId] = useState<string | null>(null);

  // Update cursor
  useEffect(() => {
    const el = gl.domElement;
    if (mode === 'delete') el.style.cursor = 'not-allowed';
    else if (mode === 'place') el.style.cursor = 'crosshair';
    else el.style.cursor = 'grab';
    return () => { el.style.cursor = ''; };
  }, [mode, gl]);

  // Keyboard undo/redo handled by parent; nothing here

  const handleSurfaceMove = useCallback((pt: THREE.Vector3) => {
    if (mode !== 'place') return;
    const [gx, gz] = worldToGridCorner(pt.x, pt.z, selW, selD);
    const bottomY = getStackHeight(bricks, gx, gz, selW, selD);
    const valid = !isOOB(gx, gz, selW, selD);
    setGhost({ gx, gz, bottomY, valid });
    setSurfaceY(bottomY + 0.002);
  }, [mode, bricks, selW, selD]);

  const handleSurfaceCommit = useCallback(() => {
    if (mode !== 'place' || !ghost || !ghost.valid) return;
    onAdd({ gx: ghost.gx, gz: ghost.gz, bottomY: ghost.bottomY, width: selW, depth: selD, brickH: selH, color });
  }, [mode, ghost, selW, selD, selH, color, onAdd]);

  const handleBrickPointerUp = useCallback((e: THREE.Event, id: string) => {
    (e as any).stopPropagation?.();
    if (mode === 'delete') { onRemove(id); return; }
    if (mode === 'view') setSelId(p => p === id ? null : id);
  }, [mode, onRemove]);

  // Disable orbit left-drag in place/delete mode so clicking places bricks
  const orbitMouseButtons = useMemo(() => (
    mode === 'view'
      ? { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }
      : { LEFT: undefined as any, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }
  ), [mode]);

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[12, 18, 10]} intensity={1.1} castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20} shadow-camera-right={20}
        shadow-camera-top={20} shadow-camera-bottom={-20}
      />
      <pointLight position={[-8, 12, -8]} intensity={0.3} color="#b3d4ff" />
      <pointLight position={[8, 6, 8]}   intensity={0.25} color="#ffe8a0" />

      <Baseplate size={GRID_STUDS} />

      {bricks.map(b => (
        <BrickMesh
          key={b.id}
          brick={b}
          selected={selId === b.id}
          hovered={hovId === b.id}
          mode={mode}
          onPointerUp={(e) => handleBrickPointerUp(e, b.id)}
          onEnter={() => setHovId(b.id)}
          onLeave={() => setHovId(null)}
        />
      ))}

      {mode === 'place' && ghost && (
        <GhostBrick
          gx={ghost.gx} gz={ghost.gz}
          w={selW} d={selD} brickH={selH}
          color={color} valid={ghost.valid}
        />
      )}

      <BuildSurface y={surfaceY} onMove={handleSurfaceMove} onCommit={handleSurfaceCommit} />

      <OrbitControls
        ref={orbitRef}
        makeDefault
        mouseButtons={orbitMouseButtons}
        touches={{ ONE: mode === 'view' ? THREE.TOUCH.ROTATE : (undefined as any), TWO: THREE.TOUCH.DOLLY_PAN }}
        enablePan enableZoom
        minDistance={3} maxDistance={40}
        maxPolarAngle={Math.PI / 2.05}
      />

      <Environment preset="city" />
    </>
  );
}

// ─── Public props ─────────────────────────────────────────────────────────────
export interface BrickSceneProps {
  selectedColor: string;
  selectedSize: string; // e.g. '2x4', '1x2', 'plate1x2'
  mode: 'place' | 'delete' | 'view';
  onBrickCountChange?: (n: number) => void;
  onUndo?: (fn: () => void) => void;
  onRedo?: (fn: () => void) => void;
  onReset?: (fn: () => void) => void;
}

// Map size key → { w, d, h }
const SIZE_MAP: Record<string, [number, number, number]> = {
  '1x1':       [1, 1, BRICK_H],
  '1x2':       [1, 2, BRICK_H],
  '2x2':       [2, 2, BRICK_H],
  '2x3':       [2, 3, BRICK_H],
  '2x4':       [2, 4, BRICK_H],
  '1x4':       [1, 4, BRICK_H],
  '1x6':       [1, 6, BRICK_H],
  '2x6':       [2, 6, BRICK_H],
  'plate1x1':  [1, 1, PLATE_H],
  'plate1x2':  [1, 2, PLATE_H],
  'plate2x2':  [2, 2, PLATE_H],
  'plate2x4':  [2, 4, PLATE_H],
};

export default function BrickScene({
  selectedColor, selectedSize, mode,
  onBrickCountChange, onUndo, onRedo, onReset,
}: BrickSceneProps) {
  const [state, dispatch] = useReducer(bReducer, { bricks: [], past: [], future: [] });

  const [selW, selD, selH] = SIZE_MAP[selectedSize] ?? [2, 4, BRICK_H];

  // Expose undo/redo/reset to parent toolbar
  useEffect(() => { onUndo?.(() => dispatch({ type: 'UNDO' })); }, [onUndo]);
  useEffect(() => { onRedo?.(() => dispatch({ type: 'REDO' })); }, [onRedo]);
  useEffect(() => { onReset?.(() => dispatch({ type: 'RESET' })); }, [onReset]);
  useEffect(() => { onBrickCountChange?.(state.bricks.length); }, [state.bricks.length, onBrickCountChange]);

  const handleAdd = useCallback((data: Omit<LegoUnit, 'id'>) => dispatch({ type: 'ADD', data }), []);
  const handleRemove = useCallback((id: string) => dispatch({ type: 'REMOVE', id }), []);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [14, 14, 14], fov: 45, near: 0.1, far: 300 }}
        style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #D6EEFF 100%)' }}
        dpr={[1, 2]}
      >
        <Scene
          bricks={state.bricks}
          mode={mode}
          selW={selW} selD={selD} selH={selH}
          color={selectedColor}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      </Canvas>
    </div>
  );
}
