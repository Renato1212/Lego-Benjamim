'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Package,
  Lightbulb,
  Cuboid,
  Image,
  Star,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store/app';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: <Home className="w-5 h-5" />,
    color: '#FFCC00',
    bgColor: 'bg-yellow-50',
  },
  {
    href: '/brick-box',
    label: 'Brick Box',
    icon: <Package className="w-5 h-5" />,
    color: '#D01012',
    bgColor: 'bg-red-50',
  },
  {
    href: '/build-ideas',
    label: 'Ideas',
    icon: <Lightbulb className="w-5 h-5" />,
    color: '#FF6B00',
    bgColor: 'bg-orange-50',
  },
  {
    href: '/builder',
    label: 'Builder',
    icon: <Cuboid className="w-5 h-5" />,
    color: '#006DB7',
    bgColor: 'bg-blue-50',
  },
  {
    href: '/gallery',
    label: 'Gallery',
    icon: <Image className="w-5 h-5" />,
    color: '#7B2D8B',
    bgColor: 'bg-purple-50',
  },
  {
    href: '/quests',
    label: 'Quests',
    icon: <Star className="w-5 h-5" />,
    color: '#4D924A',
    bgColor: 'bg-green-50',
  },
];

export default function KidNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAppStore((s) => s.user);

  const isParentPage = pathname.startsWith('/parents');
  if (isParentPage) return null;

  return (
    <>
      {/* Desktop Sidebar Nav */}
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
                  'w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer group',
                  isActive
                    ? 'shadow-lg'
                    : 'hover:bg-gray-50'
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
              title="Parent Dashboard"
            >
              <Users className="w-5 h-5" />
              <span className="text-[9px] font-bold font-body">Parents</span>
            </motion.div>
          </Link>
        </div>
      </nav>

      {/* Mobile Top Nav */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b-2 border-gray-100 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧱</span>
            <span className="text-xl font-heading text-lego-dark">BrickVerse</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-lego-yellow/20 rounded-xl px-3 py-1">
              <span className="text-sm font-bold text-lego-dark">{user.avatar}</span>
              <span className="text-sm font-bold text-lego-dark">{user.name}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-gray-100 text-lego-dark"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Bottom Nav Bar */}
        <div className="flex items-center justify-around px-2 pb-2 gap-1">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <motion.div
                  className={cn(
                    'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all',
                    isActive ? 'text-white' : 'text-gray-500'
                  )}
                  style={isActive ? { backgroundColor: item.color } : {}}
                  whileTap={{ scale: 0.9 }}
                >
                  {item.icon}
                  <span className="text-[10px] font-bold">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Full Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-30 bg-white/95 backdrop-blur-md pt-24"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="p-6 grid grid-cols-2 gap-4">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-2xl border-2 font-bold font-body transition-all',
                        isActive
                          ? 'text-white border-transparent'
                          : 'bg-white border-gray-100 text-gray-700 hover:border-current'
                      )}
                      style={isActive ? { backgroundColor: item.color, borderColor: item.color } : { color: item.color }}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
