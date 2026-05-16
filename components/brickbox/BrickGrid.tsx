'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrickBoxStore } from '@/lib/store/brickbox';
import BrickTile from './BrickTile';

interface BrickGridProps {
  filter?: string;
}

export default function BrickGrid({ filter }: BrickGridProps) {
  const { getBricksByColor, inventory } = useBrickBoxStore();
  const bricksByColor = getBricksByColor();

  const filteredBricksByColor = filter
    ? Object.fromEntries(
        Object.entries(bricksByColor).filter(([colorName]) =>
          colorName.toLowerCase().includes(filter.toLowerCase())
        )
      )
    : bricksByColor;

  if (inventory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="text-8xl mb-4">📦</div>
        <h3 className="text-2xl font-heading text-lego-dark mb-2">Sua Caixinha está Vazia!</h3>
        <p className="text-gray-500 font-body">Busque um conjunto LEGO acima para começar a adicionar peças à sua coleção.</p>
      </motion.div>
    );
  }

  const colorEntries = Object.entries(filteredBricksByColor);

  if (colorEntries.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 font-body text-lg">Nenhuma peça com a cor &quot;{filter}&quot;</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {colorEntries.map(([colorName, bricks], colorIndex) => {
          const totalQty = bricks.reduce((sum, b) => sum + b.quantity, 0);
          const colorRgb = bricks[0]?.colorRgb || 'CCCCCC';
          const bgColor = `#${colorRgb}`;

          return (
            <motion.div
              key={colorName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: colorIndex * 0.05 }}
            >
              {/* Color Section Header */}
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md flex-shrink-0"
                  style={{ backgroundColor: bgColor, boxShadow: `0 0 12px ${bgColor}60` }}
                  whileHover={{ scale: 1.2 }}
                />
                <h3 className="text-lg font-heading text-lego-dark">{colorName}</h3>
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-sm font-body font-bold text-gray-400">
                  {totalQty} peças · {bricks.length} tipos
                </span>
              </div>

              {/* Bricks Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-6">
                {bricks.map((brick, brickIndex) => (
                  <BrickTile
                    key={`${brick.partNum}-${brick.colorId}`}
                    brick={brick}
                    index={colorIndex * 4 + brickIndex}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
