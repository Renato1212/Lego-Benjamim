'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';

interface StoryDisplayProps {
  story: string;
  creationName: string;
  onRegenerate?: () => Promise<void>;
}

export default function StoryDisplay({ story, creationName, onRegenerate }: StoryDisplayProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentStory] = useState(story);

  const handleRegenerate = async () => {
    if (!onRegenerate) return;
    setIsRegenerating(true);
    try {
      await onRegenerate();
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl p-4 border-2"
      style={{ background: 'linear-gradient(135deg, #F0F4FF, #FFF0F8)', borderColor: '#7B2D8B20' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4" style={{ color: '#7B2D8B' }} />
        <span className="text-sm font-heading" style={{ color: '#7B2D8B' }}>
          A História de &quot;{creationName}&quot;
        </span>
      </div>

      {isRegenerating ? (
        <div className="flex items-center gap-3 py-4">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#7B2D8B' }} />
          <p className="font-body text-sm text-gray-500">Escrevendo uma nova história... ✨</p>
        </div>
      ) : (
        <motion.p
          key={currentStory}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-body text-sm text-gray-700 leading-relaxed italic"
        >
          &ldquo;{currentStory}&rdquo;
        </motion.p>
      )}

      {onRegenerate && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 text-xs font-body font-bold px-3 py-1.5 rounded-xl transition-colors"
            style={{ color: '#7B2D8B', background: '#7B2D8B15' }}
            aria-label="Gerar nova história"
          >
            <RefreshCw className="w-3 h-3" />
            Nova História
          </button>
        </div>
      )}
    </motion.div>
  );
}
