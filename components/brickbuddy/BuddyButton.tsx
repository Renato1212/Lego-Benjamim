'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/app';
import BuddyChat from './BuddyChat';

export default function BuddyButton() {
  const { isBuddyOpen, toggleBuddy } = useAppStore();

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-lego-yellow border-b-4 border-amber-500 shadow-xl flex items-center justify-center text-2xl cursor-pointer"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleBuddy}
        aria-label="Open Brick Buddy chat"
        style={{ boxShadow: '0 8px 32px rgba(255, 204, 0, 0.5)' }}
      >
        <motion.span
          animate={isBuddyOpen ? { rotate: 0 } : { rotate: [0, 10, -10, 0] }}
          transition={isBuddyOpen ? {} : { duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          {isBuddyOpen ? '✕' : '🧱'}
        </motion.span>

        {/* Pulse ring */}
        {!isBuddyOpen && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full bg-lego-yellow"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.span
              className="absolute inset-0 rounded-full bg-lego-yellow"
              animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isBuddyOpen && <BuddyChat />}
      </AnimatePresence>
    </>
  );
}
