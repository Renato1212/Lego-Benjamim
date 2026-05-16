'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Target, ChevronRight } from 'lucide-react';
import type { BuildIdea } from '@/lib/store/app';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const THEME_EMOJIS: Record<string, string> = {
  Space: '🚀',
  Fantasy: '🏰',
  Ocean: '🌊',
  City: '🏙️',
  'Sci-Fi': '🤖',
  Nature: '🌿',
  Medieval: '⚔️',
};

const DIFF_CONFIG: Record<string, { color: string; label: string; stars: number }> = {
  easy: { color: '#4D924A', label: 'Easy', stars: 1 },
  medium: { color: '#FF6B00', label: 'Medium', stars: 2 },
  hard: { color: '#D01012', label: 'Hard', stars: 3 },
};

interface IdeaCardProps {
  idea: BuildIdea;
  index: number;
  isExpanded?: boolean;
  onExpand?: () => void;
}

export default function IdeaCard({ idea, index, onExpand }: IdeaCardProps) {
  const diffConf = DIFF_CONFIG[idea.difficulty] || DIFF_CONFIG.easy;
  const stars = '⭐'.repeat(diffConf.stars);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-white/80 cursor-pointer"
      onClick={onExpand}
      layout
    >
      {/* Card Image Area */}
      <div
        className="relative h-44 flex items-center justify-center text-7xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${diffConf.color}15 0%, ${diffConf.color}25 100%)`,
        }}
      >
        <motion.span
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
        >
          {THEME_EMOJIS[idea.theme] || '🧱'}
        </motion.span>

        {/* Match badge */}
        <div
          className="absolute top-3 right-3 px-3 py-1 rounded-full text-white font-bold text-sm font-body"
          style={{ backgroundColor: idea.matchPercentage >= 90 ? '#4D924A' : idea.matchPercentage >= 75 ? '#FF6B00' : '#006DB7' }}
        >
          {idea.matchPercentage}% match
        </div>

        {/* Theme badge */}
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-xl bg-white/80 text-xs font-bold font-body" style={{ color: '#1A1A2E' }}>
          {idea.theme}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="text-xl font-heading mb-2" style={{ color: '#1A1A2E' }}>{idea.title}</h3>
        <p className="text-sm font-body text-gray-500 mb-4 leading-relaxed">{idea.description}</p>

        {/* Match Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-body font-semibold text-gray-400 flex items-center gap-1">
              <Target className="w-3 h-3" /> Brick Match
            </span>
            <span className="text-xs font-bold font-body" style={{ color: diffConf.color }}>
              {idea.matchPercentage}%
            </span>
          </div>
          <Progress value={idea.matchPercentage} color={diffConf.color} className="h-2" />
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1 text-xs font-body text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {idea.timeEstimate}
          </div>
          <div className="flex items-center gap-1 text-xs font-body text-gray-400">
            <Zap className="w-3.5 h-3.5" />
            ~{idea.estimatedParts} parts
          </div>
          <span className="text-xs font-body">{stars}</span>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          {idea.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full font-body font-semibold"
              style={{ background: '#FFF8E7', color: '#1A1A2E' }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Button
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span>Let&apos;s Build!</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
