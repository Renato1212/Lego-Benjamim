# BrickVerse Phase 1 Foundation

## Overview
Complete scaffold of the BrickVerse LEGO companion app for kids 6-12.

## Tech Stack
- Next.js 15 (App Router) + React 19 + TypeScript strict
- Tailwind CSS v4 with custom LEGO color palette
- Framer Motion for all animations
- Three.js + @react-three/fiber + @react-three/drei for 3D builder
- Zustand (with persist) for state management
- Prisma ORM with PostgreSQL schema
- Anthropic Claude API (server-side, kid-safe)

## Demo Mode
Set `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local` for full functionality without API keys.

All features work beautifully in demo mode with rich mock data:
- 847 bricks across 12 colors
- 3 owned LEGO sets
- 5 AI-generated build ideas
- 3 gallery creations with AI stories
- 4 earned badges
- Level 3 "Architect" with 2340 XP
- Daily quest system

## Routes
- `/` — Home page with hero, stats, ideas, badges, gallery teaser
- `/brick-box` — Inventory management with set search
- `/build-ideas` — Filtered AI build idea cards
- `/builder` — 3D React Three Fiber sandbox
- `/gallery` — Creation gallery with AI stories
- `/quests` — Gamification: quests, badges, XP
- `/parents` — Parent dashboard (PIN: 1234)

## API Routes
- `GET /api/lego/sets?q=query` — Set search (Rebrickable proxy)
- `GET /api/lego/parts?setNum=xxx` — Parts fetch
- `POST /api/ai/buddy` — Brick Buddy AI chat
- `POST /api/ai/ideas` — Build ideas generation
- `POST /api/ai/story` — Creation story generation

## Phase 2 Roadmap
- Real Clerk authentication integration
- PostgreSQL database setup with Prisma migrations
- Photo scanning of physical bricks (camera API)
- Social features: sharing, following other builders
- Printable building instructions
- Weekly featured builds
- Parent email reports
- PWA support for offline use

## Color Palette
- Primary: `#FFCC00` (LEGO Yellow)
- Red: `#D01012`
- Blue: `#006DB7`
- Green: `#4D924A`
- Background: `#FFF8E7` (warm cream)
- Dark: `#1A1A2E`

## Environment Variables Required
See `.env.local` for the template.
