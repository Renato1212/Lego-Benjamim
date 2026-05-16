'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Package,
  Lightbulb,
  Cuboid,
  ImageIcon,
  Star,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store/app';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Início',
    icon: <Home className="w-5 h-5" />,
    color: '#FFCC00',
  },
  {
    href: '/brick-box',
    label: 'Caixinha',
    icon: <Package className="w-5 h-5" />,
    color: '#D01012',
  },
  {
    href: '/build-ideas',
    label: 'Ideias',
    icon: <Lightbulb className="w-5 h-5" />,
    color: '#FF6B00',
  },
  {
    href: '/builder',
    label: 'Construtor',
    icon: <Cuboid className="w-5 h-5" />,
    color: '#006DB7',
  },
  {
    href: '/gallery',
    label: 'Universo',
    icon: <ImageIcon className="w-5 h-5" />,
    color: '#7B2D8B',
  },
  {
    href: '/quests',
    label: 'Missões',
    icon: <Star className="w-5 h-5" />,
    color: '#4D924A',
  },
];

export default function KidNav() {
  const pathname = usePathname();
  const user = useAppStore((s) => s.user);

  const isParentPage = pathname.startsWith('/parents');
  if (isParentPage) return null;

  return (
    <>
      {/* ── Desktop Sidebar Nav (md+) ── */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center py-6 gap-3 bg-white border-r-2 border-gray-100 shadow-lg z-40">
        {/* Logo */}
        <Link href="/" className="mb-4">
          <motion.div
            className="w-12 h-12 rounded-2xl bg-lego-yellow flex items-center justify-center text-xl font-heading text-lego-dark shadow-md"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            🧱
          </motion.div>
        </Link>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={cn(
                  'w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer',
                  isActive ? 'shadow-lg' : 'hover:bg-gray-50'
                )}
                style={isActive ? { backgroundColor: item.color, color: 'white' } : { color: item.color }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                title={item.label}
              >
                {item.icon}
                <span className="text-[9px] font-bold font-body opacity-80">
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}

        {/* Parent Mode */}
        <div className="mt-auto">
          <Link href="/parents">
            <motion.div
              className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:bg-gray-50 transition-all"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              title="Pais"
            >
              <Users className="w-5 h-5" />
              <span className="text-[9px] font-bold font-body">Pais</span>
            </motion.div>
          </Link>
        </div>
      </nav>

      {/* ── Mobile Top Bar (< md) ── */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b-2 border-gray-100 shadow-md h-[60px] flex items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🧱</span>
          <span className="text-xl font-heading text-lego-dark">BrickVerse</span>
        </Link>

        <div className="ml-auto flex items-center gap-2 bg-lego-yellow/20 rounded-xl px-3 py-1.5">
          <span className="text-sm font-bold text-lego-dark">{user.avatar}</span>
          <span className="text-sm font-bold text-lego-dark">Nível {user.level}</span>
        </div>
      </nav>

      {/* ── Mobile Bottom Nav Bar (< md) ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around px-1 h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <motion.div
                  className={cn(
                    'flex flex-col items-center justify-center gap-0.5 h-12 mx-1 rounded-2xl transition-all',
                    isActive ? 'text-white' : 'text-gray-400'
                  )}
                  style={isActive ? { backgroundColor: item.color } : {}}
                  whileTap={{ scale: 0.88 }}
                >
                  {item.icon}
                  <span
                    className="text-[10px] font-bold font-body leading-none"
                    style={isActive ? {} : { color: item.color }}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
