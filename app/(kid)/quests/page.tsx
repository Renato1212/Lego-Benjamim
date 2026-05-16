'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Calendar, Lock } from 'lucide-react';
import { useAppStore } from '@/lib/store/app';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const WEEKLY_CHALLENGE = {
  title: 'Rainbow Builder Challenge',
  description: 'Build one creation using at least 7 different colors this week!',
  xpReward: 500,
  progress: 3,
  total: 7,
  endsIn: '3 days',
  icon: '🌈',
};

const PAST_QUESTS = [
  { title: 'First Steps', description: 'Add your first LEGO set', completed: true, xp: 50, icon: '👶' },
  { title: 'Color Explorer', description: 'Use 5 different brick colors', completed: true, xp: 75, icon: '🎨' },
  { title: 'Brick Collector', description: 'Own more than 100 bricks', completed: true, xp: 100, icon: '📦' },
  { title: 'Storyteller', description: 'Generate your first AI story', completed: false, xp: 125, icon: '📖' },
];

export default function QuestsPage() {
  const { user, badges, dailyQuest, completeQuest } = useAppStore();

  const earnedBadges = badges.filter((b) => b.isEarned);
  const unearnedBadges = badges.filter((b) => !b.isEarned);
  const xpPercent = (user.xp / user.xpToNextLevel) * 100;

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md"
          style={{ background: '#D4F0D3' }}>
          <Star className="w-6 h-6" style={{ color: '#4D924A' }} />
        </div>
        <div>
          <h1 className="text-4xl font-heading" style={{ color: '#1A1A2E' }}>Brick Quests</h1>
          <p className="font-body text-gray-500">Complete quests to earn XP and unlock badges!</p>
        </div>
      </motion.div>

      {/* Level & XP Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl p-6 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%)' }}
      >
        <div className="absolute top-4 right-6 text-6xl opacity-20 animate-float select-none">⚡</div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-heading text-lego-dark shadow-lg"
              style={{ background: '#FFCC00' }}
            >
              {user.level}
            </div>
            <div>
              <p className="text-white/60 text-sm font-body font-semibold uppercase tracking-wide">Level {user.level}</p>
              <h2 className="text-3xl font-heading text-white">{user.levelName}</h2>
              <p className="text-white/60 text-sm font-body">
                {user.xp.toLocaleString()} / {user.xpToNextLevel.toLocaleString()} XP
              </p>
            </div>
          </div>

          <Progress
            value={xpPercent}
            color="#FFCC00"
            className="h-3 bg-white/20"
          />

          <p className="text-white/50 text-xs font-body mt-2">
            {(user.xpToNextLevel - user.xp).toLocaleString()} XP until Level {user.level + 1}
          </p>
        </div>
      </motion.div>

      {/* Daily Quest */}
      <section className="mb-8">
        <h2 className="text-2xl font-heading mb-4" style={{ color: '#1A1A2E' }}>
          🌅 Daily Quest
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-lg border-2"
          style={{ borderColor: dailyQuest.isCompleted ? '#4D924A40' : '#FFCC0040' }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: dailyQuest.isCompleted ? '#4D924A20' : '#FFCC0020' }}
            >
              {dailyQuest.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-heading" style={{ color: '#1A1A2E' }}>{dailyQuest.title}</h3>
                {dailyQuest.isCompleted && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold font-body text-white" style={{ background: '#4D924A' }}>
                    ✓ Done!
                  </span>
                )}
              </div>
              <p className="font-body text-gray-500 text-sm mb-4">{dailyQuest.description}</p>

              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-4 h-4" style={{ color: '#FFCC00' }} />
                <span className="text-sm font-bold font-body" style={{ color: '#FF6B00' }}>
                  +{dailyQuest.xpReward} XP Reward
                </span>
              </div>

              <Progress
                value={dailyQuest.isCompleted ? 100 : (dailyQuest.progress / dailyQuest.total) * 100}
                color={dailyQuest.isCompleted ? '#4D924A' : '#FFCC00'}
                className="h-3 mb-3"
              />
            </div>

            {!dailyQuest.isCompleted && (
              <Button onClick={completeQuest} className="flex-shrink-0">
                <Zap className="w-4 h-4" />
                Complete!
              </Button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Weekly Challenge */}
      <section className="mb-8">
        <h2 className="text-2xl font-heading mb-4" style={{ color: '#1A1A2E' }}>
          📅 Weekly Challenge
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl p-6 shadow-lg overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #006DB7 0%, #0099E5 100%)' }}
        >
          <div className="absolute top-3 right-6 text-6xl opacity-20 animate-float select-none">
            {WEEKLY_CHALLENGE.icon}
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-white/70" />
              <span className="text-xs text-white/70 font-body font-semibold">
                Ends in {WEEKLY_CHALLENGE.endsIn}
              </span>
            </div>
            <h3 className="text-2xl font-heading text-white mb-2">{WEEKLY_CHALLENGE.title}</h3>
            <p className="text-white/80 font-body text-sm mb-4">{WEEKLY_CHALLENGE.description}</p>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-bold font-body text-lego-yellow">
                +{WEEKLY_CHALLENGE.xpReward} XP
              </span>
              <span className="text-white/60 text-sm font-body">
                · Progress: {WEEKLY_CHALLENGE.progress}/{WEEKLY_CHALLENGE.total} colors
              </span>
            </div>

            <Progress
              value={(WEEKLY_CHALLENGE.progress / WEEKLY_CHALLENGE.total) * 100}
              color="#FFCC00"
              className="h-3 bg-white/20"
            />
          </div>
        </motion.div>
      </section>

      {/* Past Quests */}
      <section className="mb-8">
        <h2 className="text-2xl font-heading mb-4" style={{ color: '#1A1A2E' }}>
          📋 Quest Log
        </h2>
        <div className="space-y-3">
          {PAST_QUESTS.map((quest, i) => (
            <motion.div
              key={quest.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="bg-white rounded-2xl p-4 shadow-sm border-2 border-white/80 flex items-center gap-4"
              style={{ borderColor: quest.completed ? '#4D924A20' : 'transparent' }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: quest.completed ? '#4D924A20' : '#F0F0F0' }}
              >
                {quest.completed ? quest.icon : <Lock className="w-5 h-5 text-gray-300" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading text-base" style={{ color: '#1A1A2E' }}>{quest.title}</h4>
                  {quest.completed && (
                    <span className="text-xs text-lego-green font-bold font-body">✓</span>
                  )}
                </div>
                <p className="text-xs font-body text-gray-400">{quest.description}</p>
              </div>
              <div
                className="text-sm font-bold font-body flex-shrink-0"
                style={{ color: quest.completed ? '#4D924A' : '#888' }}
              >
                +{quest.xp} XP
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Badges Section */}
      <section>
        <h2 className="text-2xl font-heading mb-4" style={{ color: '#1A1A2E' }}>
          🏆 My Badges
        </h2>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-body font-semibold text-gray-400 mb-3">Earned ({earnedBadges.length})</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {earnedBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8 + i * 0.1, type: 'spring', stiffness: 300 }}
                  className="bg-white rounded-2xl p-4 text-center shadow-md border-2"
                  style={{ borderColor: `${badge.color}30` }}
                  whileHover={{ scale: 1.05, y: -3 }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-2 shadow-sm"
                    style={{ background: `${badge.color}20` }}
                  >
                    {badge.icon}
                  </div>
                  <p className="font-heading text-sm" style={{ color: '#1A1A2E' }}>{badge.name}</p>
                  <p className="text-xs font-body text-gray-400 mt-1">{badge.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        {unearnedBadges.length > 0 && (
          <div>
            <p className="text-sm font-body font-semibold text-gray-400 mb-3">Locked ({unearnedBadges.length})</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {unearnedBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 + i * 0.08 }}
                  className="bg-gray-50 rounded-2xl p-4 text-center border-2 border-gray-100 opacity-70"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center text-3xl mx-auto mb-2 grayscale">
                    {badge.icon}
                  </div>
                  <p className="font-heading text-sm text-gray-400">{badge.name}</p>
                  <p className="text-xs font-body text-gray-300 mt-1">{badge.description}</p>
                  <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400 font-body">
                    <Lock className="w-3 h-3" />
                    Locked
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
