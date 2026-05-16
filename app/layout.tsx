import type { Metadata } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import './globals.css';
import KidNav from '@/components/layout/KidNav';
import BrickParticles from '@/components/layout/BrickParticles';
import BuddyButton from '@/components/brickbuddy/BuddyButton';

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BrickVerse — Seu Universo LEGO',
  description: 'O aplicativo companheiro de LEGO definitivo para jovens construtores de 6 a 12 anos. Acompanhe suas peças, obtenha ideias de construção e compartilhe suas criações!',
  keywords: ['LEGO', 'crianças', 'construção', 'criativo', 'peças', 'educativo'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fredoka.variable} ${nunito.variable} h-full`}
    >
      <body className="min-h-full bg-lego-cream font-body antialiased">
        {/* Partículas de fundo */}
        <BrickParticles />

        {/* Navegação */}
        <KidNav />

        {/* Área de conteúdo principal */}
        <main className="relative z-10 md:pl-20 pt-[60px] pb-[80px] md:pt-0 md:pb-0 min-h-screen">
          {children}
        </main>

        {/* Botão flutuante do Amigo Construtor */}
        <BuddyButton />
      </body>
    </html>
  );
}
