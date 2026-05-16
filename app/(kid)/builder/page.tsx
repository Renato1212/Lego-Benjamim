'use client';

import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Share2, RotateCcw, HelpCircle, X, Cuboid } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import BrickPalette from '@/components/builder/BrickPalette';

const BrickScene = dynamic(() => import('@/components/builder/BrickScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-200 to-blue-100 rounded-2xl">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🧱</div>
        <p className="font-heading text-lego-dark text-xl">Loading 3D Builder...</p>
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
      className="absolute inset-0 bg-lego-dark/80 backdrop-blur-sm z-20 rounded-2xl flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
      >
        <h2 className="text-2xl font-heading mb-4" style={{ color: '#1A1A2E' }}>
          🧱 Welcome to the 3D Builder!
        </h2>
        <div className="space-y-3 mb-6">
          {[
            { icon: '🖱️', text: 'Left-click and drag to rotate the view' },
            { icon: '🔍', text: 'Scroll to zoom in and out' },
            { icon: '↔️', text: 'Right-click and drag to pan around' },
            { icon: '🎨', text: 'Pick a color and size from the palette' },
            { icon: '💾', text: 'Save your creation when you\'re done!' },
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
        <Button onClick={onClose} className="w-full">
          Let&apos;s Build! 🚀
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

  const handleSave = async () => {
    setSaved(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSaved(false);
  };

  return (
    <div className="h-screen flex flex-col px-4 py-4 md:px-6 md:py-6 gap-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md"
            style={{ background: '#D6EAFF' }}>
            <Cuboid className="w-5 h-5" style={{ color: '#006DB7' }} />
          </div>
          <div>
            <h1 className="text-2xl font-heading" style={{ color: '#1A1A2E' }}>3D Builder</h1>
            <p className="text-xs font-body text-gray-400">Build anything you can imagine!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowHelp(true)}
          >
            <HelpCircle className="w-4 h-4" />
            Help
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {}}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saved}
          >
            {saved ? '✅ Saved!' : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Main Builder Area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* 3D Viewport */}
        <div className="flex-1 relative rounded-2xl overflow-hidden" style={{ minHeight: '400px' }}>
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-200 to-blue-100 rounded-2xl">
              <div className="text-center">
                <div className="text-6xl mb-4">🧱</div>
                <p className="font-heading text-xl" style={{ color: '#1A1A2E' }}>Loading...</p>
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
              🧱 Demo Build — Your Space Station
            </div>
          </div>

          {/* Reset view button */}
          <button
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl p-2 text-gray-500 hover:text-lego-dark hover:bg-white transition-all shadow-sm"
            title="Reset camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Brick Palette Sidebar */}
        <div className="w-44 flex-shrink-0 overflow-y-auto">
          <BrickPalette
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
          />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-4 bg-white rounded-2xl px-5 py-3 shadow-md border-2 border-white/80"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-md border-2 border-white shadow-sm"
            style={{
              backgroundColor: selectedColor,
              boxShadow: `0 2px 4px rgba(0,0,0,0.2), inset 0 -2px 0 rgba(0,0,0,0.2)`,
            }}
          />
          <span className="text-sm font-body font-bold" style={{ color: '#1A1A2E' }}>
            {selectedSize} brick
          </span>
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <span className="text-sm font-body text-gray-400">7 bricks placed</span>
        <div className="h-4 w-px bg-gray-200" />
        <span className="text-sm font-body text-gray-400">Click a brick to select it</span>
      </motion.div>
    </div>
  );
}
