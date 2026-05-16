'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store/app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEMO_BUDDY_RESPONSES } from '@/lib/ai/demo-responses';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  "What can I build? 🚀",
  "Give me a challenge! 💪",
  "How do I make wings? 🦋",
  "Best colors to mix? 🎨",
];

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'assistant',
  content: "Hey there, Master Builder! 🧱✨ I'm Brix, your Brick Buddy! I'm here to help you build amazing things. What incredible creation are we making today?",
  timestamp: new Date(),
};

let msgCounter = 0;
function genId(prefix: string) {
  msgCounter += 1;
  return `${prefix}-${msgCounter}`;
}

export default function BuddyChat() {
  const { closeBuddy } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: genId('user'),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

      if (isDemoMode) {
        const delayMs = 1200;
        await new Promise((r) => setTimeout(r, delayMs));
        const responseIndex = msgCounter % DEMO_BUDDY_RESPONSES.length;
        const response = DEMO_BUDDY_RESPONSES[responseIndex];
        setMessages((prev) => [
          ...prev,
          {
            id: genId('buddy'),
            role: 'assistant',
            content: response,
            timestamp: new Date(),
          },
        ]);
      } else {
        const response = await fetch('/api/ai/buddy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!response.ok) throw new Error('API error');
        const data = await response.json();

        setMessages((prev) => [
          ...prev,
          {
            id: genId('buddy'),
            role: 'assistant',
            content: data.message,
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: genId('buddy-err'),
          role: 'assistant',
          content: "Oops! My bricks got mixed up! 🧱 Try asking again - I'm ready to help!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <motion.div
      className="fixed bottom-24 right-6 z-50 w-[340px] rounded-3xl bg-white shadow-2xl border-2 border-lego-yellow/30 overflow-hidden"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      {/* Header */}
      <div className="bg-lego-yellow px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white/30 flex items-center justify-center text-xl">
          🧱
        </div>
        <div>
          <p className="font-heading text-lego-dark text-lg leading-none">Brix</p>
          <p className="text-xs font-body text-lego-dark/70 font-semibold">Your Brick Buddy</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-body text-lego-dark/70">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="h-72 overflow-y-auto p-4 space-y-3 bg-lego-cream/50">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-lego-yellow flex items-center justify-center text-sm flex-shrink-0">
                🧱
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm font-body ${
                msg.role === 'user'
                  ? 'bg-lego-blue text-white rounded-tr-none'
                  : 'bg-white text-lego-dark rounded-tl-none border border-gray-100 shadow-sm'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-lego-yellow flex items-center justify-center text-sm">
              🧱
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 border border-gray-100 shadow-sm">
              <div className="flex gap-1 items-center">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-lego-yellow"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 flex flex-wrap gap-1">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="text-xs px-2 py-1 rounded-xl bg-lego-yellow/20 text-lego-dark font-semibold hover:bg-lego-yellow/40 transition-colors font-body"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 flex gap-2">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Brix anything..."
          className="h-10 text-sm rounded-xl border-gray-200"
          disabled={isTyping}
        />
        <Button
          type="submit"
          size="icon"
          className="h-10 w-10 rounded-xl flex-shrink-0"
          disabled={isTyping || !input.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </motion.div>
  );
}
