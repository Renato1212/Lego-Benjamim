'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Layers, Search, SlidersHorizontal } from 'lucide-react';
import { useBrickBoxStore } from '@/lib/store/brickbox';
import BrickGrid from '@/components/brickbox/BrickGrid';
import SetSearch from '@/components/brickbox/SetSearch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

export default function BrickBoxPage() {
  const { initDemoData, getStats, ownedSets, inventory } = useBrickBoxStore();
  const [colorFilter, setColorFilter] = useState('');

  useEffect(() => {
    initDemoData();
  }, [initDemoData]);

  const stats = useMemo(() => getStats(), [ownedSets, inventory, getStats]);

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md"
            style={{ background: '#FFE0E0' }}>
            <Package className="w-6 h-6" style={{ color: '#D01012' }} />
          </div>
          <div>
            <h1 className="text-4xl font-heading" style={{ color: '#1A1A2E' }}>My Brick Box</h1>
            <p className="font-body text-gray-500">Your complete LEGO collection in one place</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: '🧱', label: 'Total Bricks', value: stats.totalBricks || 847, color: '#D01012' },
          { icon: '🎨', label: 'Colors', value: stats.totalColors || 12, color: '#7B2D8B' },
          { icon: '📦', label: 'Sets Owned', value: stats.totalSets || 3, color: '#006DB7' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring' }}
            className="bg-white rounded-2xl p-4 shadow-md border-2 border-white text-center"
            style={{ borderColor: `${stat.color}20` }}
          >
            <div className="text-3xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-heading" style={{ color: stat.color }}>{stat.value.toLocaleString()}</div>
            <div className="text-xs font-body text-gray-400 font-semibold">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Owned Sets */}
      {ownedSets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-heading mb-3" style={{ color: '#1A1A2E' }}>Owned Sets</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {ownedSets.map((set, i) => (
              <motion.div
                key={set.setNum}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex-shrink-0 bg-white rounded-2xl p-3 shadow-md border-2 border-white/80 w-44"
                whileHover={{ y: -3, scale: 1.02 }}
              >
                <div className="w-full h-24 rounded-xl bg-gradient-to-br from-lego-yellow/20 to-lego-blue/20 flex items-center justify-center text-4xl mb-2">
                  📦
                </div>
                <p className="font-heading text-sm leading-tight" style={{ color: '#1A1A2E' }}>{set.name}</p>
                <p className="text-xs font-body text-gray-400 mt-1">{set.numParts} pieces · {set.year}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="inventory">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="inventory" className="gap-2">
              <Layers className="w-4 h-4" />
              My Bricks
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-2">
              <Search className="w-4 h-4" />
              Add Sets
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 flex items-center gap-2 sm:max-w-xs">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <Input
              placeholder="Filter by color..."
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="h-10 text-sm"
            />
          </div>
        </div>

        <TabsContent value="inventory">
          <BrickGrid filter={colorFilter} />
        </TabsContent>

        <TabsContent value="search">
          <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-white/80">
            <h2 className="text-xl font-heading mb-2" style={{ color: '#1A1A2E' }}>
              Find &amp; Add LEGO Sets
            </h2>
            <p className="text-sm font-body text-gray-500 mb-5">
              Search for any LEGO set and add it to your collection. All the pieces will be added to your brick inventory!
            </p>
            <SetSearch />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
