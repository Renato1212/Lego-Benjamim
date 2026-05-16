'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { BrickEntry } from '@/lib/store/brickbox';

interface BrickTileProps {
  brick: BrickEntry;
  index: number;
}

export default function BrickTile({ brick, index }: BrickTileProps) {
  const bgColor = `#${brick.colorRgb}`;
  const isLight = isLightColor(brick.colorRgb);
  const textColor = isLight ? '#1A1A2E' : '#FFFFFF';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        delay: index * 0.04,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      whileHover={{ scale: 1.08, y: -4, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      className="relative rounded-xl cursor-pointer select-none"
      style={{
        backgroundColor: bgColor,
        boxShadow: `inset 0 -4px 0 rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.15)`,
      }}
    >
      {/* Studs */}
      <div className="absolute -top-2 left-0 right-0 flex justify-center gap-1.5">
        <div
          className="w-4 h-4 rounded-full"
          style={{
            backgroundColor: bgColor,
            boxShadow: `inset 0 -1px 0 rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.15)`,
            filter: 'brightness(1.1)',
          }}
        />
        <div
          className="w-4 h-4 rounded-full"
          style={{
            backgroundColor: bgColor,
            boxShadow: `inset 0 -1px 0 rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.15)`,
            filter: 'brightness(1.1)',
          }}
        />
      </div>

      {/* Main brick body */}
      <div className="pt-3 pb-2 px-3">
        <p className="text-xs font-heading leading-tight" style={{ color: textColor }}>
          {brick.name}
        </p>
        <p className="text-lg font-heading mt-1" style={{ color: textColor }}>
          ×{brick.quantity}
        </p>
      </div>

      {/* Shine overlay */}
      <div className="absolute top-0 left-0 right-0 h-1/3 rounded-t-xl opacity-20"
        style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), transparent)' }}
      />
    </motion.div>
  );
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}
