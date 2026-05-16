'use client';

import React from 'react';
import { useRef } from 'react';
import type * as THREE from 'three';

interface BaseplateProps {
  size?: number;
}

export default function Baseplate({ size = 16 }: BaseplateProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const studSpacing = 0.8;
  const studRadius = 0.22;
  const studHeight = 0.12;
  const plateColor = '#4D924A';
  const studColor = '#3d7a3b';

  const studs = [];
  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      studs.push({
        x: (x - size / 2 + 0.5) * studSpacing,
        z: (z - size / 2 + 0.5) * studSpacing,
      });
    }
  }

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Base plate */}
      <mesh receiveShadow>
        <boxGeometry args={[size * studSpacing, 0.3, size * studSpacing]} />
        <meshStandardMaterial color={plateColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Studs */}
      {studs.map(({ x, z }, i) => (
        <mesh key={i} position={[x, 0.21, z]} castShadow>
          <cylinderGeometry args={[studRadius, studRadius, studHeight, 12]} />
          <meshStandardMaterial color={studColor} roughness={0.5} metalness={0.15} />
        </mesh>
      ))}
    </group>
  );
}
