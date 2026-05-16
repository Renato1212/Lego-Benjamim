'use client';

import React, { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Share2, RotateCcw, HelpCircle, Cuboid, Undo2, Redo2, Trash } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import BrickPalette, { type BuildMode } from '@/components/builder/BrickPalette';

const BrickScene = dynamic(() => import('@/components/builder/BrickScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-200 to-blue-100 rounded-2xl">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🧱</div>
        <p className="font-heading text-lego-dark text-xl">Carregando Construtor 3D...</p>
        <p className="text-sm font-body text-gray-500 mt-1">Motor LEGO a carregar…</p>
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
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl"
      >
        <h2 className="text-xl font-heading mb-4 text-lego-dark">🧱 Construtor 3D LEGO</h2>
        <div className="space-y-2.5 mb-5">
          {[
            { icon: '🏗️', text: 'Selecione "Colocar" e clique na base verde para adicionar peças' },
            { icon: '🗑️', text: 'Selecione "Apagar" e clique em uma peça para removê-la' },
            { icon: '🔄', text: 'Botão direito + arrastar para girar a câmera' },
            { icon: '🔍', text: 'Roda do mouse para zoom' },
            { icon: '⌨️', text: 'Ctrl+Z desfazer · Ctrl+Y refazer' },
            { icon: '📱', text: 'No celular: dois dedos giram e ampliam' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-3 text-sm font-body text-gray-600"
            >
              <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </div>
        <Button onClick={onClose} className="w-full h-12 text-base">
          Vamos Construir! 🚀
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function BuilderPage() {
  const [selectedColor, setSelectedColor] = useState('#D01012');
  const [selectedSize, setSelectedSize]   = useState('2x4');
  const [mode, setMode]                   = useState<BuildMode>('place');
  const [brickCount, setBrickCount]       = useState(0);
  const [showTutorial, setShowTutorial]   = useState(true);
  const [showHelp, setShowHelp]           = useState(false);
  const [showPalette, setShowPalette]     = useState(false);
  const [saved, setSaved]                 = useState(false);

  // Refs that hold the undo/redo/reset functions exposed by BrickScene
  const undoFnRef  = useRef<(() => void) | null>(null);
  const redoFnRef  = useRef<(() => void) | null>(null);
  const resetFnRef = useRef<(() => void) | null>(null);

  // Wire keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undoFnRef.current?.(); }
      if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redoFnRef.current?.(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSave = async () => {
    setSaved(true);
    await new Promise(r => setTimeout(r, 1800));
    setSaved(false);
  };

  const registerUndo  = useCallback((fn: () => void) => { undoFnRef.current  = fn; }, []);
  const registerRedo  = useCallback((fn: () => void) => { redoFnRef.current  = fn; }, []);
  const registerReset = useCallback((fn: () => void) => { resetFnRef.current = fn; }, []);

  return (
    <div className="h-[calc(100vh-60px-80px)] md:h-screen flex flex-col px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-5 gap-2 md:gap-3">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-shrink-0 gap-2"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md bg-blue-100 flex-shrink-0">
            <Cuboid className="w-5 h-5 text-lego-blue" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-2xl font-heading text-lego-dark leading-tight">Construtor 3D</h1>
            <p className="text-xs font-body text-gray-400">Grade de pinos real · empilhamento correto</p>
          </div>
          <h1 className="sm:hidden text-lg font-heading text-lego-dark">Construtor 3D</h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Undo / Redo */}
          <button
            onClick={() => undoFnRef.current?.()}
            className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
            title="Desfazer (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => redoFnRef.current?.()}
            className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
            title="Refazer (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => resetFnRef.current?.()}
            className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-all"
            title="Limpar tudo"
          >
            <Trash className="w-4 h-4" />
          </button>

          {/* Mobile palette toggle */}
          <Button
            size="sm" variant="outline"
            className="md:hidden h-9 px-3"
            onClick={() => setShowPalette(!showPalette)}
          >
            🎨
          </Button>
          <Button size="sm" variant="outline" className="h-9 hidden sm:flex" onClick={() => setShowHelp(true)}>
            <HelpCircle className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="h-9 hidden sm:flex">
            <Share2 className="w-4 h-4" />
            <span className="hidden lg:inline">Compartilhar</span>
          </Button>
          <Button size="sm" className="h-9" onClick={handleSave} disabled={saved}>
            {saved ? '✅' : <><Save className="w-4 h-4" /><span className="hidden sm:inline ml-1">Salvar</span></>}
          </Button>
        </div>
      </motion.div>

      {/* ── Main area ── */}
      <div className="flex-1 flex gap-2 md:gap-3 min-h-0 relative">

        {/* 3-D viewport */}
        <div className="flex-1 relative rounded-2xl overflow-hidden shadow-xl">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-200 to-blue-100 rounded-2xl">
              <div className="text-6xl animate-bounce">🧱</div>
            </div>
          }>
            <BrickScene
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              mode={mode}
              onBrickCountChange={setBrickCount}
              onUndo={registerUndo}
              onRedo={registerRedo}
              onReset={registerReset}
            />
          </Suspense>

          <AnimatePresence>
            {(showTutorial || showHelp) && (
              <TutorialOverlay onClose={() => { setShowTutorial(false); setShowHelp(false); }} />
            )}
          </AnimatePresence>

          {/* Mode indicator badge */}
          <div className="absolute top-3 left-3 pointer-events-none">
            <div
              className="px-3 py-1.5 rounded-xl text-xs font-bold font-body text-white shadow-lg"
              style={{
                backgroundColor:
                  mode === 'place' ? '#006DB7' : mode === 'delete' ? '#D01012' : '#4D924A',
              }}
            >
              {mode === 'place' ? '🏗️ Colocar' : mode === 'delete' ? '🗑️ Apagar' : '👁️ Ver'}
            </div>
          </div>

          {/* Reset camera */}
          <button
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl p-2 text-gray-400 hover:text-lego-dark transition-all shadow-sm"
            title="Ajuda"
            onClick={() => setShowHelp(true)}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Palette sidebar — desktop */}
        <div className="hidden md:block w-44 lg:w-48 flex-shrink-0 overflow-y-auto">
          <BrickPalette
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
            mode={mode}
            onModeChange={setMode}
          />
        </div>

        {/* Palette drawer — mobile */}
        <AnimatePresence>
          {showPalette && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden absolute inset-0 bg-black/40 z-20 rounded-2xl"
                onClick={() => setShowPalette(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                className="md:hidden absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl max-h-[72vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
                  <span className="font-heading text-lego-dark">Paleta</span>
                  <button onClick={() => setShowPalette(false)} className="text-gray-400 text-xl w-8 h-8 flex items-center justify-center">✕</button>
                </div>
                <div className="p-4 pb-6">
                  <BrickPalette
                    selectedColor={selectedColor}
                    onColorSelect={(c) => { setSelectedColor(c); }}
                    selectedSize={selectedSize}
                    onSizeSelect={(s) => { setSelectedSize(s); }}
                    mode={mode}
                    onModeChange={(m) => { setMode(m); setShowPalette(false); }}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ── Status bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex items-center gap-2 sm:gap-3 bg-white rounded-2xl px-3 sm:px-4 py-2.5 shadow-md border border-gray-100 flex-shrink-0 text-sm font-body"
      >
        <div className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 rounded-md shadow-sm border-2 border-white"
            style={{
              backgroundColor: selectedColor,
              boxShadow: `0 2px 4px rgba(0,0,0,0.2), inset 0 -2px 0 rgba(0,0,0,0.22)`,
            }}
          />
          <span className="font-bold text-lego-dark hidden sm:inline">{selectedSize}</span>
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <span className="text-gray-500">
          <span className="font-bold text-lego-dark">{brickCount}</span>
          {' '}peças colocadas
        </span>
        {brickCount > 0 && (
          <>
            <div className="h-4 w-px bg-gray-200 hidden sm:block" />
            <span className="text-gray-400 hidden sm:inline">Ctrl+Z desfazer</span>
          </>
        )}
        <div className="ml-auto">
          <span className="text-xs text-gray-300 hidden md:inline">grade 32×32 pinos</span>
        </div>
      </motion.div>
    </div>
  );
}
