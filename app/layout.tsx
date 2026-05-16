import type { Metadata } from 'next';
import { Fredoka_One, Nunito } from 'next/font/google';
import './globals.css';
import KidNav from '@/components/layout/KidNav';
import BrickParticles from '@/components/layout/BrickParticles';
import BuddyButton from '@/components/brickbuddy/BuddyButton';

const fredokaOne = Fredoka_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BrickVerse — Your LEGO Universe',
  description: 'The ultimate LEGO companion app for young builders aged 6-12. Track your bricks, get build ideas, and share your creations!',
  keywords: ['LEGO', 'kids', 'building', 'creative', 'bricks', 'educational'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fredokaOne.variable} ${nunito.variable} h-full`}
    >
      <body className="min-h-full bg-lego-cream font-body antialiased">
        {/* Background brick particles */}
        <BrickParticles />

        {/* Kid navigation */}
        <KidNav />

        {/* Main content area — offset for sidebar on desktop, top nav on mobile */}
        <main className="relative z-10 md:pl-20 pt-[112px] md:pt-0 min-h-screen">
          {children}
        </main>

        {/* Brick Buddy floating button */}
        <BuddyButton />
      </body>
    </html>
  );
}
