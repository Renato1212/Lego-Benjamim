'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  rotation: number;
}

const LEGO_COLORS = [
  '#FFCC00', '#D01012', '#006DB7', '#4D924A',
  '#FF6B00', '#7B2D8B', '#00A3DA', '#FFD700',
];

const BrickSVG = ({ color, size }: { color: string; size: number }) => (
  <svg
    width={size}
    height={size * 0.7}
    viewBox="0 0 40 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Studs */}
    <ellipse cx="10" cy="5" rx="7" ry="4" fill={color} opacity="0.9" />
    <ellipse cx="30" cy="5" rx="7" ry="4" fill={color} opacity="0.9" />
    {/* Main body */}
    <rect x="0" y="5" width="40" height="20" rx="3" fill={color} />
    {/* Bottom shadow */}
    <rect x="0" y="21" width="40" height="4" rx="2" fill="rgba(0,0,0,0.2)" />
    {/* Top highlight */}
    <rect x="2" y="6" width="36" height="4" rx="1" fill="rgba(255,255,255,0.2)" />
  </svg>
);

// Pre-generate fixed particles at module level (deterministic, SSR-safe placeholder)
const STATIC_PARTICLES: Particle[] = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: (i * 7.3) % 100,
  y: (i * 13.7) % 100,
  size: 16 + (i * 2) % 28,
  color: LEGO_COLORS[i % LEGO_COLORS.length],
  duration: 5 + (i % 6),
  delay: (i % 4) * 0.5,
  rotation: (i * 25) % 360,
}));

// Custom hook using useSyncExternalStore for SSR-safe client detection
function useIsClient(): boolean {
  return React.useSyncExternalStore(
    (cb) => {
      window.addEventListener('bv-noop', cb);
      return () => window.removeEventListener('bv-noop', cb);
    },
    () => true,
    () => false,
  );
}

export default function BrickParticles() {
  const isClient = useIsClient();

  if (!isClient) return null;

  const particles = STATIC_PARTICLES;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute opacity-20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            rotate: particle.rotation,
          }}
          animate={{
            y: [0, -30, 0, -20, 0],
            x: [0, 10, -10, 5, 0],
            rotate: [particle.rotation, particle.rotation + 15, particle.rotation - 10, particle.rotation + 5, particle.rotation],
            opacity: [0.15, 0.25, 0.15, 0.22, 0.15],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <BrickSVG color={particle.color} size={particle.size} />
        </motion.div>
      ))}
    </div>
  );
}
