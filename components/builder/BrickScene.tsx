'use client';

import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import type * as THREE from 'three';
import Baseplate from './Baseplate';

interface PlacedBrick {
  id: string;
  position: [number, number, number];
  color: string;
  size: [number, number, number];
}

interface BrickProps {
  position: [number, number, number];
  color: string;
  size?: [number, number, number];
  isSelected?: boolean;
  onClick?: () => void;
}

function LegoStudBrick({ position, color, size = [1, 1, 1], isSelected, onClick }: BrickProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const w = size[0] * 0.79;
  const h = size[1] * 0.96;
  const d = size[2] * 0.79;
  const studSpacing = 0.8;

  const studs = [];
  for (let x = 0; x < size[0]; x++) {
    for (let z = 0; z < size[2]; z++) {
      studs.push({
        x: (x - (size[0] - 1) / 2) * studSpacing,
        z: (z - (size[2] - 1) / 2) * studSpacing,
      });
    }
  }

  return (
    <group position={position} onClick={onClick}>
      {/* Main brick body */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={hovered ? '#FFCC00' : color}
          roughness={0.4}
          metalness={0.05}
          emissive={isSelected ? color : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>

      {/* Studs on top */}
      {studs.map((stud, i) => (
        <mesh key={i} position={[stud.x, h / 2 + 0.07, stud.z]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.14, 12]} />
          <meshStandardMaterial
            color={hovered ? '#FFCC00' : color}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

const DEMO_BRICKS: PlacedBrick[] = [
  { id: '1', position: [0, 0.48, 0], color: '#D01012', size: [2, 1, 2] },
  { id: '2', position: [0.8, 1.44, 0], color: '#006DB7', size: [1, 1, 2] },
  { id: '3', position: [-0.8, 1.44, 0], color: '#FFCC00', size: [1, 1, 2] },
  { id: '4', position: [0, 2.4, 0], color: '#4D924A', size: [2, 1, 1] },
  { id: '5', position: [1.6, 0.48, 0.8], color: '#7B2D8B', size: [1, 1, 1] },
  { id: '6', position: [-1.6, 0.48, -0.8], color: '#FF6B00', size: [1, 1, 1] },
  { id: '7', position: [0, 3.36, 0], color: '#FFFFFF', size: [2, 1, 1] },
];

interface BrickSceneProps {
  onBrickPlace?: (position: [number, number, number], color: string) => void;
  selectedColor?: string;
}

export default function BrickScene({ selectedColor: _selectedColor = '#D01012' }: BrickSceneProps) {
  const [placedBricks] = useState<PlacedBrick[]>(DEMO_BRICKS);
  const [selectedBrickId, setSelectedBrickId] = useState<string | null>(null);

  const handleBrickClick = (id: string) => {
    setSelectedBrickId(selectedBrickId === id ? null : id);
  };

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [8, 8, 8], fov: 50, near: 0.1, far: 200 }}
        style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #E0F0FF 100%)' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[10, 15, 10]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-5, 10, -5]} intensity={0.4} color="#006DB7" />
          <pointLight position={[5, 5, 5]} intensity={0.3} color="#FFCC00" />

          {/* Baseplate */}
          <Baseplate size={16} />

          {/* Placed Bricks */}
          {placedBricks.map((brick) => (
            <LegoStudBrick
              key={brick.id}
              position={brick.position}
              color={brick.color}
              size={brick.size as [number, number, number]}
              isSelected={selectedBrickId === brick.id}
              onClick={() => handleBrickClick(brick.id)}
            />
          ))}

          {/* Grid helper */}
          <Grid
            args={[20, 20]}
            position={[0, -0.15, 0]}
            cellColor="#4D924A"
            sectionColor="#3d7a3b"
            cellSize={0.8}
            sectionSize={3.2}
            fadeDistance={30}
            fadeStrength={1}
            infiniteGrid={false}
          />

          {/* Camera Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={30}
            maxPolarAngle={Math.PI / 2.1}
            makeDefault
          />

          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
}
