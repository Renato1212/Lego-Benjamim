'use client';

import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Share2, RotateCcw, HelpCircle, Cuboid } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import BrickPalette from '@/components/builder/BrickPalette';

const BrickScene = dynamic(() => import('@/components/builder/BrickScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-200 to-blue-100 rounded-2xl">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🧱</div>
        <p className="font-heading text-lego-dark text-xl">Carregando Construtor 3D...</p>
      </div>
    </div>
  ),
});

function TutorialOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-lego-dark/80 backdrop-blur-sm z-20 rounded-2xl flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl"
      >
        <h2 className="text-xl sm:text-2xl font-heading mb-4" style={{ color: '#1A1A2E' }}>
          🧱 Bem-vindo ao Construtor 3D!
        </h2>
        <div className="space-y-3 mb-6">
          {[
            { icon: '🖱️', text: 'Clique e arraste para girar a vista' },
            { icon: '🔍', text: 'Rolar para ampliar e reduzir' },
            { icon: '↔️', text: 'Clique direito e arraste para deslocar' },
            { icon: '🎨', text: 'Escolha uma cor e tamanho na paleta' },
            { icon: '💾', text: 'Salve sua criação quando terminar!' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 text-sm font-body text-gray-600"
            >
              <span className="text-2xl">{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </div>
        <Button onClick={onClose} className="w-full h-12">
          Vamos Construir! 🚀
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function BuilderPage() {
  const [selectedColor, setSelectedColor] = useState('#D01012');
  const [selectedSize, setSelectedSize] = useState('2x2');
  const [showTutorial, setShowTutorial] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSaved(false);
  };

  return (
    <div className="h-[calc(100vh-60px-80px)] md:h-screen flex flex-col px-3 py-3 md:px-6 md:py-6 gap-3">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-shrink-0"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: '#D6EAFF' }}>
            <Cuboid className="w-5 h-5" style={{ color: '#006DB7' }} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading" style={{ color: '#1A1A2E' }}>Construtor 3D</h1>
            <p className="text-xs font-body text-gray-400 hidden sm:block">Construa o que você imaginar!</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile palette toggle */}
          <Button
            size="sm"
            variant="outline"
            className="md:hidden h-9"
            onClick={() => setShowPalette(!showPalette)}
          >
            🎨
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-9"
            onClick={() => setShowHelp(true)}
            aria-label="Ajuda"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Ajuda</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-9"
            onClick={() => {}}
            aria-label="Compartilhar"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
          <Button
            size="sm"
            className="h-9"
            onClick={handleSave}
            disabled={saved}
            aria-label="Salvar"
          >
            {saved ? '✅' : (
              <>
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Salvar</span>
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Main Builder Area */}
      <div className="flex-1 flex gap-3 min-h-0 relative">
        {/* 3D Viewport */}
        <div className="flex-1 relative rounded-2xl overflow-hidden">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-200 to-blue-100 rounded-2xl">
              <div className="text-center">
                <div className="text-6xl mb-4">🧱</div>
                <p className="font-heading text-xl" style={{ color: '#1A1A2E' }}>Carregando...</p>
              </div>
            </div>
          }>
            <BrickScene selectedColor={selectedColor} />
          </Suspense>

          <AnimatePresence>
            {(showTutorial || showHelp) && (
              <TutorialOverlay onClose={() => { setShowTutorial(false); setShowHelp(false); }} />
            )}
          </AnimatePresence>

          {/* Viewport HUD */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-body font-bold" style={{ color: '#1A1A2E' }}>
              🧱 Demo — Sua Estação Espacial
            </div>
          </div>

          {/* Reset view button */}
          <button
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl p-2 text-gray-500 hover:text-lego-dark hover:bg-white transition-all shadow-sm"
            title="Redefinir câmera"
            aria-label="Redefinir câmera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Brick Palette Sidebar — desktop */}
        <div className="hidden md:block w-44 flex-shrink-0 overflow-y-auto">
          <BrickPalette
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
          />
        </div>

        {/* Mobile Palette Drawer */}
        <AnimatePresence>
          {showPalette && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl max-h-[60vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <span className="font-heading text-lego-dark">Paleta</span>
                <button onClick={() => setShowPalette(false)} className="text-gray-400 text-xl">✕</button>
              </div>
              <div className="p-4">
                <BrickPalette
                  selectedColor={selectedColor}
                  onColorSelect={(c) => { setSelectedColor(c); setShowPalette(false); }}
                  selectedSize={selectedSize}
                  onSizeSelect={setSelectedSize}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-3 bg-white rounded-2xl px-4 py-2.5 shadow-md border-2 border-white/80 flex-shrink-0"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-md border-2 border-white shadow-sm"
            style={{
              backgroundColor: selectedColor,
              boxShadow: `0 2px 4px rgba(0,0,0,0.2), inset 0 -2px 0 rgba(0,0,0,0.2)`,
            }}
          />
          <span className="text-sm font-body font-bold hidden sm:inline" style={{ color: '#1A1A2E' }}>
            Peça {selectedSize}
          </span>
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <span className="text-sm font-body text-gray-400">7 peças colocadas</span>
        <div className="h-4 w-px bg-gray-200 hidden sm:block" />
        <span className="text-sm font-body text-gray-400 hidden sm:inline">Clique em uma peça para selecioná-la</span>
      </motion.div>
    </div>
  );
}
