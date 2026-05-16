'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Plus, SortAsc, Grid3X3, List } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store/app';
import CreationCard from '@/components/gallery/CreationCard';
import { Button } from '@/components/ui/button';

export default function GalleryPage() {
  const { creations, user } = useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'likes' | 'bricks'>('newest');

  const sorted = [...creations].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'likes') return b.likes - a.likes;
    if (sortBy === 'bricks') return b.bricksUsed - a.bricksUsed;
    return 0;
  });

  const totalBricksUsed = creations.reduce((sum, c) => sum + c.bricksUsed, 0);
  const totalLikes = creations.reduce((sum, c) => sum + c.likes, 0);

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md"
            style={{ background: '#EED6FF' }}>
            <ImageIcon className="w-6 h-6" style={{ color: '#7B2D8B' }} />
          </div>
          <div>
            <h1 className="text-4xl font-heading" style={{ color: '#1A1A2E' }}>My Universe</h1>
            <p className="font-body text-gray-500">{user.name}&apos;s amazing creations</p>
          </div>
        </div>

        <Link href="/builder">
          <Button className="hidden sm:flex">
            <Plus className="w-5 h-5" />
            New Creation
          </Button>
        </Link>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Creations', value: creations.length, emoji: '🏗️', color: '#7B2D8B' },
          { label: 'Total Bricks', value: totalBricksUsed, emoji: '🧱', color: '#D01012' },
          { label: 'Total Likes', value: totalLikes, emoji: '❤️', color: '#D01012' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-md border-2 border-white text-center"
            style={{ borderColor: `${stat.color}20` }}
          >
            <div className="text-3xl mb-1">{stat.emoji}</div>
            <div className="text-2xl font-heading" style={{ color: stat.color }}>
              {stat.value.toLocaleString()}
            </div>
            <div className="text-xs font-body text-gray-400 font-semibold">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-gray-400" />
          <p className="text-sm font-body font-semibold text-gray-400 mr-2">Sort:</p>
          {(['newest', 'likes', 'bricks'] as const).map((sort) => (
            <motion.button
              key={sort}
              onClick={() => setSortBy(sort)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold font-body border-2 capitalize transition-all"
              style={{
                backgroundColor: sortBy === sort ? '#7B2D8B' : 'white',
                color: sortBy === sort ? 'white' : '#7B2D8B',
                borderColor: sortBy === sort ? '#7B2D8B' : '#7B2D8B30',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sort === 'newest' ? '🕒 Newest' : sort === 'likes' ? '❤️ Liked' : '🧱 Most Bricks'}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {(['grid', 'list'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="p-1.5 rounded-lg transition-all"
              style={{
                backgroundColor: viewMode === mode ? 'white' : 'transparent',
                color: viewMode === mode ? '#7B2D8B' : '#888',
                boxShadow: viewMode === mode ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {mode === 'grid' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Gallery Grid */}
      {sorted.length > 0 ? (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {sorted.map((creation, i) => (
            <CreationCard key={creation.id} creation={creation} index={i} />
          ))}

          {/* Add New Card */}
          <Link href="/builder">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: sorted.length * 0.12 }}
              className="h-64 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
              style={{ borderColor: '#7B2D8B40', color: '#7B2D8B' }}
              whileHover={{ scale: 1.02, borderColor: '#7B2D8B' }}
            >
              <span className="text-5xl">+</span>
              <span className="font-heading text-lg">Create Something Amazing!</span>
              <span className="font-body text-sm opacity-70">Open the 3D Builder</span>
            </motion.div>
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-8xl mb-4">🏗️</div>
          <h3 className="text-2xl font-heading mb-2" style={{ color: '#1A1A2E' }}>No Creations Yet!</h3>
          <p className="font-body text-gray-500 mb-6">Start building something amazing in the 3D Builder!</p>
          <Link href="/builder">
            <Button size="lg">
              <Plus className="w-5 h-5" />
              Open 3D Builder
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
