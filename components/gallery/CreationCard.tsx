'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import type { Creation } from '@/lib/store/app';
import { Button } from '@/components/ui/button';
import StoryDisplay from './StoryDisplay';

const CREATION_EMOJIS = ['🚀', '🏰', '🌈', '🤖', '🦁', '🏗️', '🌊', '🎡'];

interface CreationCardProps {
  creation: Creation;
  index: number;
}

export default function CreationCard({ creation, index }: CreationCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(creation.likes);
  const [showStory, setShowStory] = useState(false);

  const emoji = CREATION_EMOJIS[index % CREATION_EMOJIS.length];

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, type: 'spring', stiffness: 200 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-white/80"
    >
      {/* 3D-effect thumbnail with CSS transform */}
      <div
        className="relative h-48 sm:h-52 flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, #FFF8E7 0%, #E8F4FF 100%)` }}
      >
        <motion.div
          animate={{
            rotateY: [0, 15, -15, 0],
            rotateX: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.5,
          }}
          style={{ transformStyle: 'preserve-3d', perspective: '400px' }}
          className="text-8xl"
        >
          {emoji}
        </motion.div>

        {/* Creation date */}
        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-xl px-2.5 py-1 text-xs font-body font-semibold text-gray-500">
          {formatDate(creation.createdAt)}
        </div>

        {/* Bricks count */}
        <div className="absolute bottom-3 right-3 bg-lego-dark/80 backdrop-blur-sm rounded-xl px-2.5 py-1 text-xs font-body font-bold text-white">
          🧱 {creation.bricksUsed} peças
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-heading mb-1" style={{ color: '#1A1A2E' }}>{creation.name}</h3>
        <p className="text-sm font-body text-gray-500 mb-3">{creation.description}</p>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          {creation.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full font-body font-semibold"
              style={{ background: '#FFF8E7', color: '#1A1A2E' }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleLike}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm font-body transition-colors h-10"
            style={{
              backgroundColor: liked ? '#FFE0E0' : '#F8F8F8',
              color: liked ? '#D01012' : '#888',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Curtir criação"
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            {likeCount}
          </motion.button>

          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5 text-gray-500 hover:text-lego-blue hover:bg-blue-50 h-10"
            aria-label="Compartilhar criação"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>

          <motion.button
            onClick={() => setShowStory(!showStory)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm font-body ml-auto transition-colors h-10"
            style={{
              backgroundColor: showStory ? '#7B2D8B20' : '#F8F8F8',
              color: showStory ? '#7B2D8B' : '#888',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Ver história"
          >
            <BookOpen className="w-4 h-4" />
            História
            {showStory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </motion.button>
        </div>

        {/* Story Panel */}
        <AnimatePresence>
          {showStory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4">
                <StoryDisplay story={creation.story} creationName={creation.name} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
