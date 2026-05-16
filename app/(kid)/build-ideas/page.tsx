'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store/app';
import IdeaCard from '@/components/buildideas/IdeaCard';
import { Button } from '@/components/ui/button';

const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'] as const;
const THEMES = ['all', 'Espaço', 'Fantasia', 'Oceano', 'Cidade', 'Ficção Científica'] as const;
const LEGACY_THEMES = ['Space', 'Fantasy', 'Ocean', 'City', 'Sci-Fi'] as const;

const DIFF_COLORS: Record<string, string> = {
  all: '#006DB7',
  easy: '#4D924A',
  medium: '#FF6B00',
  hard: '#D01012',
};

const DIFF_LABELS: Record<string, string> = {
  all: '✨ Todos',
  easy: '⭐ Fácil',
  medium: '⭐⭐ Médio',
  hard: '⭐⭐⭐ Difícil',
};

const THEME_MAP: Record<string, string> = {
  'Espaço': 'Space',
  'Fantasia': 'Fantasy',
  'Oceano': 'Ocean',
  'Cidade': 'City',
  'Ficção Científica': 'Sci-Fi',
};

const THEME_OF_THE_DAY = {
  theme: 'Espaço',
  emoji: '🚀',
  description: 'O tema de hoje é ESPAÇO! Construa algo fora deste mundo — foguetes, estações espaciais, planetas alienígenas ou qualquer coisa que vá até as estrelas!',
  bgColor: '#1A1A2E',
  accent: '#006DB7',
};

export default function BuildIdeasPage() {
  const { buildIdeas } = useAppStore();
  const [diffFilter, setDiffFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [themeFilter, setThemeFilter] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const filtered = buildIdeas.filter((idea) => {
    const matchDiff = diffFilter === 'all' || idea.difficulty === diffFilter;
    // Support both Portuguese and English theme names
    const matchTheme = themeFilter === 'all' ||
      idea.theme === themeFilter ||
      idea.theme === THEME_MAP[themeFilter] ||
      Object.entries(THEME_MAP).some(([pt, en]) => idea.theme === en && themeFilter === pt) ||
      idea.theme === themeFilter;
    return matchDiff && matchTheme;
  });

  const handleGenerateNew = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md"
            style={{ background: '#FFE8D0' }}>
            <Lightbulb className="w-6 h-6" style={{ color: '#FF6B00' }} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading" style={{ color: '#1A1A2E' }}>Ideias de Construção</h1>
            <p className="font-body text-gray-500 text-sm">Ideias com IA combinadas às suas peças</p>
          </div>
        </div>

        <Button
          onClick={handleGenerateNew}
          disabled={isGenerating}
          variant="secondary"
          className="hidden sm:flex h-11"
        >
          {isGenerating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          Gerar Novas
        </Button>
      </motion.div>

      {/* Theme of the Day Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl p-5 mb-6 overflow-hidden relative"
        style={{ background: `linear-gradient(135deg, ${THEME_OF_THE_DAY.bgColor}, ${THEME_OF_THE_DAY.accent})` }}
      >
        <div className="absolute top-3 right-6 text-6xl opacity-20 animate-float select-none">
          {THEME_OF_THE_DAY.emoji}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-lego-yellow" />
            <span className="text-xs font-body font-bold uppercase tracking-widest text-lego-yellow opacity-80">
              Tema do Dia
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading text-white mb-2">
            {THEME_OF_THE_DAY.emoji} {THEME_OF_THE_DAY.theme}!
          </h2>
          <p className="text-white/80 font-body text-sm max-w-lg">
            {THEME_OF_THE_DAY.description}
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6 space-y-4"
      >
        {/* Difficulty Filter */}
        <div>
          <p className="text-sm font-body font-semibold text-gray-400 mb-2 uppercase tracking-wide">Dificuldade</p>
          <div className="-mx-4 px-4 flex gap-2 overflow-x-auto pb-1 snap-x">
            {DIFFICULTIES.map((diff) => (
              <motion.button
                key={diff}
                onClick={() => setDiffFilter(diff)}
                className="flex-shrink-0 px-4 py-2 rounded-2xl text-sm font-bold font-body border-2 transition-all h-11 snap-start"
                style={{
                  backgroundColor: diffFilter === diff ? DIFF_COLORS[diff] : 'white',
                  color: diffFilter === diff ? 'white' : DIFF_COLORS[diff],
                  borderColor: DIFF_COLORS[diff] + (diffFilter === diff ? '' : '40'),
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {DIFF_LABELS[diff]}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Theme Filter */}
        <div>
          <p className="text-sm font-body font-semibold text-gray-400 mb-2 uppercase tracking-wide">Tema</p>
          <div className="-mx-4 px-4 flex gap-2 overflow-x-auto pb-1 snap-x">
            {THEMES.map((theme) => (
              <motion.button
                key={theme}
                onClick={() => setThemeFilter(theme)}
                className="flex-shrink-0 px-4 py-2 rounded-2xl text-sm font-bold font-body border-2 transition-all h-11 snap-start"
                style={{
                  backgroundColor: themeFilter === theme ? '#006DB7' : 'white',
                  color: themeFilter === theme ? 'white' : '#006DB7',
                  borderColor: themeFilter === theme ? '#006DB7' : '#006DB720',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {theme === 'all' ? '🌟 Todos os Temas' : theme}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm font-body text-gray-400 mb-5 font-semibold"
      >
        Mostrando {filtered.length} {filtered.length === 1 ? 'ideia' : 'ideias'}
        {(diffFilter !== 'all' || themeFilter !== 'all') && ' com os filtros atuais'}
      </motion.p>

      {/* Ideas Grid */}
      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((idea, i) => (
              <IdeaCard key={idea.id} idea={idea} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-4">🤔</div>
            <h3 className="text-2xl font-heading mb-2" style={{ color: '#1A1A2E' }}>Nenhuma Ideia Encontrada!</h3>
            <p className="font-body text-gray-500">Tente mudar os filtros para ver mais ideias.</p>
            <Button
              className="mt-4"
              onClick={() => { setDiffFilter('all'); setThemeFilter('all'); }}
            >
              Limpar Filtros
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate More Button (mobile) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex justify-center sm:hidden"
      >
        <Button onClick={handleGenerateNew} disabled={isGenerating} variant="secondary" className="h-12">
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          Gerar Mais Ideias
        </Button>
      </motion.div>
    </div>
  );
}
