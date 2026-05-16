'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, MousePointer2, Trash2, Eye } from 'lucide-react';

export const BRICK_COLORS = [
  { name: 'Vermelho',       color: '#D01012' },
  { name: 'Azul',           color: '#006DB7' },
  { name: 'Amarelo',        color: '#FFCC00' },
  { name: 'Verde',          color: '#4D924A' },
  { name: 'Laranja',        color: '#FF6B00' },
  { name: 'Roxo',           color: '#7B2D8B' },
  { name: 'Branco',         color: '#F0F0F0' },
  { name: 'Preto',          color: '#1A1A2E' },
  { name: 'Azul Claro',     color: '#4FC3F7' },
  { name: 'Rosa',           color: '#F06292' },
  { name: 'Verde Limão',    color: '#9CCC65' },
  { name: 'Marrom',         color: '#795548' },
];

export const BRICK_SIZES = [
  // Standard bricks
  { label: '1×1',   value: '1x1',  group: 'Tijolos' },
  { label: '1×2',   value: '1x2',  group: 'Tijolos' },
  { label: '2×2',   value: '2x2',  group: 'Tijolos' },
  { label: '2×3',   value: '2x3',  group: 'Tijolos' },
  { label: '2×4',   value: '2x4',  group: 'Tijolos' },
  { label: '1×4',   value: '1x4',  group: 'Tijolos' },
  { label: '1×6',   value: '1x6',  group: 'Tijolos' },
  { label: '2×6',   value: '2x6',  group: 'Tijolos' },
  // Plates (thinner)
  { label: '1×1 Placa', value: 'plate1x1', group: 'Placas' },
  { label: '1×2 Placa', value: 'plate1x2', group: 'Placas' },
  { label: '2×2 Placa', value: 'plate2x2', group: 'Placas' },
  { label: '2×4 Placa', value: 'plate2x4', group: 'Placas' },
];

export type BuildMode = 'place' | 'delete' | 'view';

const MODES: { value: BuildMode; icon: React.ReactNode; label: string; bg: string }[] = [
  { value: 'place',  icon: <MousePointer2 className="w-4 h-4" />, label: 'Colocar', bg: '#006DB7' },
  { value: 'delete', icon: <Trash2 className="w-4 h-4" />,        label: 'Apagar',  bg: '#D01012' },
  { value: 'view',   icon: <Eye className="w-4 h-4" />,           label: 'Ver',     bg: '#4D924A' },
];

interface BrickPaletteProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  mode: BuildMode;
  onModeChange: (mode: BuildMode) => void;
}

export default function BrickPalette({
  selectedColor, onColorSelect,
  selectedSize, onSizeSelect,
  mode, onModeChange,
}: BrickPaletteProps) {
  const brickSizes  = BRICK_SIZES.filter(s => s.group === 'Tijolos');
  const plateSizes  = BRICK_SIZES.filter(s => s.group === 'Placas');

  return (
    <div className="bg-white rounded-3xl p-4 shadow-lg border border-gray-100 flex flex-col gap-4 h-full overflow-y-auto">

      {/* Mode selector */}
      <div>
        <p className="text-[11px] font-heading uppercase tracking-wide text-gray-400 mb-2">Modo</p>
        <div className="flex gap-1.5">
          {MODES.map(m => (
            <motion.button
              key={m.value}
              onClick={() => onModeChange(m.value)}
              className="flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl text-xs font-bold font-body border-2 transition-all"
              style={{
                backgroundColor: mode === m.value ? m.bg : '#F8F8F8',
                color:            mode === m.value ? '#fff' : '#555',
                borderColor:      mode === m.value ? m.bg  : '#E8E8E8',
              }}
              whileTap={{ scale: 0.92 }}
              title={m.label}
            >
              {m.icon}
              <span className="text-[9px]">{m.label}</span>
            </motion.button>
          ))}
        </div>
        {mode === 'place' && (
          <p className="text-[10px] text-gray-400 mt-1.5 text-center font-body">
            Clique na base para colocar
          </p>
        )}
        {mode === 'delete' && (
          <p className="text-[10px] text-red-400 mt-1.5 text-center font-body">
            Clique em uma peça para apagar
          </p>
        )}
        {mode === 'view' && (
          <p className="text-[10px] text-gray-400 mt-1.5 text-center font-body">
            Arraste para girar a câmera
          </p>
        )}
      </div>

      {/* Color picker */}
      <div>
        <p className="text-[11px] font-heading uppercase tracking-wide text-gray-400 mb-2">Cor</p>
        <div className="grid grid-cols-4 gap-1.5">
          {BRICK_COLORS.map((b) => (
            <motion.button
              key={b.color}
              onClick={() => onColorSelect(b.color)}
              className="aspect-square rounded-xl flex items-center justify-center border-2"
              style={{
                backgroundColor: b.color,
                borderColor: selectedColor === b.color ? '#1A1A2E' : 'transparent',
                boxShadow: selectedColor === b.color
                  ? `0 0 0 2px ${b.color}, 0 0 0 4px #1A1A2E`
                  : `inset 0 -3px 0 rgba(0,0,0,0.22)`,
              }}
              whileHover={{ scale: 1.12, y: -1 }}
              whileTap={{ scale: 0.88 }}
              title={b.name}
              aria-label={b.name}
            >
              {selectedColor === b.color && (
                <Check
                  className="w-3 h-3"
                  style={{ color: ['#F0F0F0','#FFCC00','#9CCC65'].includes(b.color) ? '#1A1A2E' : '#fff' }}
                />
              )}
            </motion.button>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 text-center font-body">
          {BRICK_COLORS.find(b => b.color === selectedColor)?.name ?? 'Personalizado'}
        </p>
      </div>

      {/* Brick sizes */}
      <div>
        <p className="text-[11px] font-heading uppercase tracking-wide text-gray-400 mb-2">Tijolos</p>
        <div className="grid grid-cols-2 gap-1.5">
          {brickSizes.map(s => (
            <motion.button
              key={s.value}
              onClick={() => onSizeSelect(s.value)}
              className="py-1.5 px-2 rounded-xl text-[11px] font-bold font-body border-2"
              style={{
                backgroundColor: selectedSize === s.value ? '#1A1A2E' : '#F8F8F8',
                color:            selectedSize === s.value ? '#fff'    : '#1A1A2E',
                borderColor:      selectedSize === s.value ? '#1A1A2E' : '#E8E8E8',
              }}
              whileTap={{ scale: 0.92 }}
            >
              {s.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Plate sizes */}
      <div>
        <p className="text-[11px] font-heading uppercase tracking-wide text-gray-400 mb-2">Placas Finas</p>
        <div className="grid grid-cols-2 gap-1.5">
          {plateSizes.map(s => (
            <motion.button
              key={s.value}
              onClick={() => onSizeSelect(s.value)}
              className="py-1.5 px-2 rounded-xl text-[11px] font-bold font-body border-2"
              style={{
                backgroundColor: selectedSize === s.value ? '#4D924A' : '#F0F7F0',
                color:            selectedSize === s.value ? '#fff'    : '#4D924A',
                borderColor:      selectedSize === s.value ? '#4D924A' : '#C8E6C9',
              }}
              whileTap={{ scale: 0.92 }}
            >
              {s.label}
            </motion.button>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-center font-body">⅓ da altura de um tijolo</p>
      </div>

      {/* Controls reference */}
      <div className="mt-auto pt-3 border-t border-gray-100">
        <p className="text-[10px] font-body text-gray-400 font-semibold mb-1.5">Controles</p>
        <div className="space-y-1 text-[10px] font-body text-gray-400">
          <p>🖱️ Btn dir + arrastar → Girar</p>
          <p>🖱️ Rolar → Zoom</p>
          <p>📱 2 dedos → Girar / Zoom</p>
          <p>🏗️ Clique esq → Colocar / Apagar</p>
        </div>
      </div>
    </div>
  );
}
