'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Package,
  Trophy,
  Lightbulb,
  Zap,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { useAppStore } from '@/lib/store/app';
import { useBrickBoxStore } from '@/lib/store/brickbox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bgColor: string;
  delay: number;
}

function StatCard({ icon, label, value, color, bgColor, delay }: StatCardProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.floor(value / 40));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplayed(value);
        clearInterval(timer);
      } else {
        setDisplayed(start);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      className="bg-white rounded-3xl p-5 border-2 border-white shadow-lg hover-lift"
      style={{ borderColor: `${color}30` }}
      whileHover={{ y: -4 }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-sm"
        style={{ backgroundColor: bgColor }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <p className="text-3xl font-heading" style={{ color }}>
        {displayed.toLocaleString()}
      </p>
      <p className="text-sm font-body text-gray-500 font-semibold mt-1">{label}</p>
    </motion.div>
  );
}

function IdeaPreviewCard({
  title,
  theme,
  difficulty,
  matchPercentage,
  delay,
}: {
  title: string;
  theme: string;
  difficulty: string;
  matchPercentage: number;
  delay: number;
}) {
  const THEME_EMOJIS: Record<string, string> = {
    Space: '🚀',
    Fantasy: '🏰',
    Ocean: '🌊',
    City: '🏙️',
    'Sci-Fi': '🤖',
  };

  const DIFF_COLORS: Record<string, string> = {
    easy: '#4D924A',
    medium: '#FF6B00',
    hard: '#D01012',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 25 }}
      className="flex-shrink-0 w-56 bg-white rounded-3xl p-4 border-2 border-white/80 shadow-lg scroll-snap-start cursor-pointer"
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <div className="w-full h-28 rounded-2xl bg-gradient-to-br from-lego-yellow/30 to-lego-blue/20 flex items-center justify-center text-5xl mb-3">
        {THEME_EMOJIS[theme] || '🧱'}
      </div>
      <h3 className="font-heading text-lego-dark text-base leading-tight mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full border"
          style={{
            backgroundColor: `${DIFF_COLORS[difficulty]}15`,
            color: DIFF_COLORS[difficulty],
            borderColor: `${DIFF_COLORS[difficulty]}40`,
          }}
        >
          {difficulty}
        </span>
        <span className="text-xs font-bold" style={{ color: '#4D924A' }}>{matchPercentage}% match</span>
      </div>
    </motion.div>
  );
}

function CreationPreviewCard({
  creation,
  index,
  delay,
}: {
  creation: { name: string; bricksUsed: number; likes: number };
  index: number;
  delay: number;
}) {
  const CREATION_EMOJIS = ['🚀', '🏰', '🌈', '🤖', '🦁'];
  const emoji = CREATION_EMOJIS[index % CREATION_EMOJIS.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className="flex-shrink-0 w-48 bg-white rounded-2xl overflow-hidden shadow-lg scroll-snap-start cursor-pointer"
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <div className="h-32 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-5xl">
        {emoji}
      </div>
      <div className="p-3">
        <p className="font-heading text-lego-dark text-sm leading-tight">{creation.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400 font-body">{creation.bricksUsed} bricks</span>
          <span className="flex items-center gap-0.5 text-xs font-bold" style={{ color: '#D01012' }}>
            <Heart className="w-3 h-3 fill-current" />
            {creation.likes}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const { user, dailyQuest, buildIdeas, creations, badges, completeQuest, openBuddy } = useAppStore();
  const { initDemoData, inventory, ownedSets, getStats } = useBrickBoxStore();

  useEffect(() => {
    initDemoData();
  }, [initDemoData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stats = useMemo(() => getStats(), [inventory, ownedSets]);

  const earnedBadges = badges.filter((b) => b.isEarned);
  const xpPercent = (user.xp / user.xpToNextLevel) * 100;

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 max-w-6xl mx-auto">
      {/* HERO SECTION */}
      <section className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="relative rounded-3xl p-8 overflow-hidden shadow-xl"
          style={{ background: 'linear-gradient(135deg, #FFCC00 0%, #FF9500 60%, #FF6B00 100%)' }}
        >
          {/* Floating decorations */}
          <div className="absolute top-4 right-8 text-4xl opacity-30 animate-float select-none">🧱</div>
          <div className="absolute bottom-6 right-20 text-2xl opacity-20 animate-float-delay-1 select-none">⬡</div>
          <div className="absolute top-8 right-36 text-3xl opacity-25 animate-float-delay-2 select-none">🔷</div>

          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="font-body font-bold text-sm uppercase tracking-widest mb-1 opacity-70"
              style={{ color: '#1A1A2E' }}
            >
              Welcome back, Master Builder
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-heading leading-tight mb-3"
              style={{ color: '#1A1A2E' }}
            >
              Hey, {user.name}! 🧱
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-body text-lg mb-5 max-w-md opacity-80"
              style={{ color: '#1A1A2E' }}
            >
              Ready to build something incredible today? Your bricks are waiting!
            </motion.p>

            {/* XP Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-2xl p-4 max-w-sm mb-5"
              style={{ background: 'rgba(255,255,255,0.35)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <span className="font-heading text-lg" style={{ color: '#1A1A2E' }}>
                    Level {user.level} — {user.levelName}
                  </span>
                </div>
                <span className="text-sm font-bold font-body opacity-70" style={{ color: '#1A1A2E' }}>
                  {user.xp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()} XP
                </span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.4)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: '#1A1A2E' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/build-ideas">
                <Button size="lg" className="bg-lego-dark text-white border-b-4 border-black/40 hover:bg-lego-dark/90 shadow-lg">
                  <Lightbulb className="w-5 h-5" />
                  Get Build Ideas
                </Button>
              </Link>
              <button onClick={openBuddy}>
                <Button size="lg" variant="outline" className="bg-white/60 border-2 border-lego-dark/20 hover:bg-white/80" style={{ color: '#1A1A2E' }}>
                  🧱 Ask Brix
                </Button>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* QUICK STATS */}
      <section className="mb-10">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-heading mb-4"
          style={{ color: '#1A1A2E' }}
        >
          Your Brick Stats 📊
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Package className="w-6 h-6" />}
            label="Total Bricks"
            value={stats.totalBricks}
            color="#D01012"
            bgColor="#FFE0E0"
            delay={0.5}
          />
          <StatCard
            icon={<span className="text-2xl">📦</span>}
            label="Owned Sets"
            value={stats.totalSets}
            color="#006DB7"
            bgColor="#D6EAFF"
            delay={0.6}
          />
          <StatCard
            icon={<span className="text-2xl">🎨</span>}
            label="Colors"
            value={stats.totalColors}
            color="#7B2D8B"
            bgColor="#EED6FF"
            delay={0.7}
          />
          <StatCard
            icon={<Trophy className="w-6 h-6" />}
            label="Creations"
            value={creations.length}
            color="#4D924A"
            bgColor="#D4F0D3"
            delay={0.8}
          />
        </div>
      </section>

      {/* DAILY QUEST */}
      <section className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="bg-white rounded-3xl p-6 border-2 shadow-lg"
          style={{ borderColor: dailyQuest.isCompleted ? '#4D924A40' : '#FFCC0040' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{dailyQuest.icon}</span>
                <Badge className="text-xs" style={{ backgroundColor: '#FFCC0020', color: '#1A1A2E', borderColor: '#FFCC00' }}>
                  Daily Quest
                </Badge>
                {dailyQuest.isCompleted && (
                  <Badge variant="green" className="text-xs">
                    ✓ Complete!
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-heading mb-1" style={{ color: '#1A1A2E' }}>{dailyQuest.title}</h3>
              <p className="text-gray-500 font-body text-sm mb-4">{dailyQuest.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-body font-semibold text-gray-400">Progress</span>
                  <span className="text-xs font-body font-bold" style={{ color: '#4D924A' }}>
                    +{dailyQuest.xpReward} XP reward
                  </span>
                </div>
                <Progress
                  value={dailyQuest.isCompleted ? 100 : (dailyQuest.progress / dailyQuest.total) * 100}
                  color="#FFCC00"
                  className="h-3"
                />
              </div>
            </div>

            {!dailyQuest.isCompleted ? (
              <Button
                onClick={completeQuest}
                className="flex-shrink-0"
                size="sm"
              >
                <Zap className="w-4 h-4" />
                Complete!
              </Button>
            ) : (
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: '#4D924A20' }}>
                ✅
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* TODAY'S BUILD IDEAS */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-heading"
            style={{ color: '#1A1A2E' }}
          >
            Today&apos;s Build Ideas 💡
          </motion.h2>
          <Link href="/build-ideas">
            <motion.span
              className="flex items-center gap-1 font-bold font-body text-sm cursor-pointer hover:underline"
              style={{ color: '#006DB7' }}
              whileHover={{ x: 3 }}
            >
              See all <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scroll-snap-x">
          {buildIdeas.map((idea, i) => (
            <Link key={idea.id} href="/build-ideas">
              <IdeaPreviewCard
                title={idea.title}
                theme={idea.theme}
                difficulty={idea.difficulty}
                matchPercentage={idea.matchPercentage}
                delay={0.7 + i * 0.08}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* BADGES */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-heading"
            style={{ color: '#1A1A2E' }}
          >
            My Badges 🏆
          </motion.h2>
          <Link href="/quests">
            <motion.span
              className="flex items-center gap-1 font-bold font-body text-sm cursor-pointer hover:underline"
              style={{ color: '#006DB7' }}
              whileHover={{ x: 3 }}
            >
              See all <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </div>
        <div className="flex gap-3 flex-wrap">
          {earnedBadges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.8 + i * 0.1, type: 'spring', stiffness: 300 }}
              className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2 shadow-md border-2"
              style={{ borderColor: `${badge.color}40` }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="font-body font-bold text-sm" style={{ color: '#1A1A2E' }}>{badge.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MY UNIVERSE TEASER */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-4">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-heading"
            style={{ color: '#1A1A2E' }}
          >
            My Universe 🌌
          </motion.h2>
          <Link href="/gallery">
            <motion.span
              className="flex items-center gap-1 font-bold font-body text-sm cursor-pointer hover:underline"
              style={{ color: '#006DB7' }}
              whileHover={{ x: 3 }}
            >
              View gallery <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scroll-snap-x">
          {creations.map((creation, i) => (
            <Link key={creation.id} href="/gallery">
              <CreationPreviewCard creation={creation} index={i} delay={0.9 + i * 0.1} />
            </Link>
          ))}
          <Link href="/builder">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="flex-shrink-0 w-48 h-[180px] border-4 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
              style={{ borderColor: '#FFCC0070', color: '#FFCC00' }}
              whileHover={{ scale: 1.02, borderColor: '#FFCC00' }}
            >
              <span className="text-4xl">+</span>
              <span className="font-heading text-sm text-center px-2">Create Something New!</span>
            </motion.div>
          </Link>
        </div>
      </section>
    </div>
  );
}
