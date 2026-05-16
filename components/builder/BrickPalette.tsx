'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const BRICK_COLORS = [
  { name: 'Vermelho', color: '#D01012', hex: 'C91A09' },
  { name: 'Azul', color: '#006DB7', hex: '0055BF' },
  { name: 'Amarelo', color: '#FFCC00', hex: 'F2CD37' },
  { name: 'Verde', color: '#4D924A', hex: '237841' },
  { name: 'Laranja', color: '#FF6B00', hex: 'FE8A18' },
  { name: 'Roxo', color: '#7B2D8B', hex: '81007B' },
  { name: 'Branco', color: '#F0F0F0', hex: 'FFFFFF' },
  { name: 'Preto', color: '#222222', hex: '05131D' },
  { name: 'Azul Claro', color: '#87CEEB', hex: '9FC3E9' },
  { name: 'Rosa', color: '#FF69B4', hex: 'FF84B7' },
  { name: 'Verde Limão', color: '#AACE47', hex: 'BBE90B' },
  { name: 'Vermelho Escuro', color: '#8B0000', hex: '720E0F' },
];

const BRICK_SIZES = [
  { label: '1×1', value: '1x1', w: 1, h: 1, d: 1 },
  { label: '1×2', value: '1x2', w: 1, h: 1, d: 2 },
  { label: '2×2', value: '2x2', w: 2, h: 1, d: 2 },
  { label: '2×4', value: '2x4', w: 2, h: 1, d: 4 },
  { label: '1×4', value: '1x4', w: 1, h: 1, d: 4 },
  { label: 'Alta 1×2', value: 't1x2', w: 1, h: 2, d: 2 },
];

interface BrickPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  selectedSize: string;
  onSizeSelect: (size: string) => void;
}

export default function BrickPalette({
  selectedColor,
  onColorSelect,
  selectedSize,
  onSizeSelect,
}: BrickPaletteProps) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-lg border-2 border-white/80 h-full flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-heading mb-3 uppercase tracking-wide" style={{ color: '#1A1A2E' }}>
          Cores
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {BRICK_COLORS.map((brick, i) => (
            <motion.button
              key={brick.color}
              onClick={() => onColorSelect(brick.color)}
              className="relative w-full aspect-square rounded-xl border-3 transition-all flex items-center justify-center"
              style={{
                backgroundColor: brick.color,
                borderColor: selectedColor === brick.color ? '#1A1A2E' : 'transparent',
                boxShadow: selectedColor === brick.color ? `0 0 0 2px ${brick.color}, 0 0 0 4px #1A1A2E` : `inset 0 -2px 0 rgba(0,0,0,0.2)`,
              }}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              title={brick.name}
              aria-label={brick.name}
            >
              {selectedColor === brick.color && (
                <Check className="w-3 h-3" style={{ color: brick.name === 'Branco' || brick.name === 'Amarelo' || brick.name === 'Verde Limão' ? '#1A1A2E' : 'white' }} />
              )}
            </motion.button>
          ))}
        </div>

        {/* Selected Color Label */}
        <p className="text-xs font-body text-gray-400 mt-2 text-center">
          {BRICK_COLORS.find((b) => b.color === selectedColor)?.name || 'Personalizado'}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-heading mb-3 uppercase tracking-wide" style={{ color: '#1A1A2E' }}>
          Tamanho da Peça
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {BRICK_SIZES.map((size) => (
            <motion.button
              key={size.value}
              onClick={() => onSizeSelect(size.value)}
              className="py-2 px-3 rounded-xl text-xs font-bold font-body border-2 transition-all"
              style={{
                backgroundColor: selectedSize === size.value ? '#1A1A2E' : '#F8F8F8',
                color: selectedSize === size.value ? 'white' : '#1A1A2E',
                borderColor: selectedSize === size.value ? '#1A1A2E' : '#E0E0E0',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {size.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <p className="text-xs font-body text-gray-400 font-semibold mb-2">Controles</p>
        <div className="space-y-1 text-xs font-body text-gray-400">
          <p>🖱️ Arraste esq: Girar</p>
          <p>🖱️ Arraste dir: Mover</p>
          <p>🖱️ Rolar: Zoom</p>
          <p>Clique peça: Selecionar</p>
        </div>
      </div>
    </div>
  );
}
