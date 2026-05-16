'use client';

import React, { useMemo } from 'react';
import { STUD_PITCH, STUD_R, STUD_HEIGHT, GRID_HALF } from './BrickScene';

interface BaseplateProps {
  size?: number; // number of studs per side
}

export default function Baseplate({ size = 32 }: BaseplateProps) {
  const plateThick = 0.32;
  const plateColor = '#4D924A';
  const studColor  = '#3d7a3b';
  const edgeColor  = '#3a7038';
  const totalW = size * STUD_PITCH;

  const studs = useMemo(() => {
    const out = [];
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        out.push({
          x: (x - GRID_HALF) * STUD_PITCH,
          z: (z - GRID_HALF) * STUD_PITCH,
        });
      }
    }
    return out;
  }, [size]);

  return (
    <group position={[0, -plateThick / 2, 0]}>
      {/* Main plate body */}
      <mesh receiveShadow>
        <boxGeometry args={[totalW, plateThick, totalW]} />
        <meshStandardMaterial color={plateColor} roughness={0.6} metalness={0.08} />
      </mesh>

      {/* Bottom ledge (slightly wider, like a real baseplate) */}
      <mesh position={[0, -plateThick / 2 - 0.05, 0]} receiveShadow>
        <boxGeometry args={[totalW + 0.2, 0.1, totalW + 0.2]} />
        <meshStandardMaterial color={edgeColor} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Studs */}
      {studs.map(({ x, z }, i) => (
        <mesh key={i} position={[x, plateThick / 2 + STUD_HEIGHT / 2, z]} castShadow>
          <cylinderGeometry args={[STUD_R, STUD_R, STUD_HEIGHT, 16]} />
          <meshStandardMaterial color={studColor} roughness={0.5} metalness={0.12} />
        </mesh>
      ))}
    </group>
  );
}
