import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  levelName: string;
  xp: number;
  xpToNextLevel: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
  isEarned: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  total: number;
  isCompleted: boolean;
  icon: string;
}

export interface Creation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  story: string;
  bricksUsed: number;
  createdAt: string;
  tags: string[];
  likes: number;
}

export interface BuildIdea {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  theme: string;
  estimatedParts: number;
  matchPercentage: number;
  imageUrl: string;
  tags: string[];
  timeEstimate: string;
}

interface AppState {
  user: UserProfile;
  badges: Badge[];
  dailyQuest: DailyQuest;
  creations: Creation[];
  buildIdeas: BuildIdea[];
  isBuddyOpen: boolean;
  isParentMode: boolean;
  isParentAuthenticated: boolean;
  theme: 'light' | 'dark';
  toggleBuddy: () => void;
  closeBuddy: () => void;
  openBuddy: () => void;
  completeQuest: () => void;
  updateXP: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
  addCreation: (creation: Omit<Creation, 'id' | 'createdAt'>) => void;
  authenticateParent: (pin: string) => boolean;
  setParentMode: (mode: boolean) => void;
}

const DEMO_USER: UserProfile = {
  id: 'demo-user-1',
  name: 'Benjamim',
  avatar: '🧱',
  level: 3,
  levelName: 'Arquiteto',
  xp: 2340,
  xpToNextLevel: 3000,
};

const DEMO_BADGES: Badge[] = [
  {
    id: 'first-build',
    name: 'Primeira Construção',
    description: 'Completou sua primeira criação!',
    icon: '🏗️',
    color: '#FFCC00',
    earnedAt: '2024-01-15T10:00:00Z',
    isEarned: true,
  },
  {
    id: 'color-wizard',
    name: 'Mago das Cores',
    description: 'Usou 10 cores diferentes em uma criação',
    icon: '🌈',
    color: '#7B2D8B',
    earnedAt: '2024-01-20T14:30:00Z',
    isEarned: true,
  },
  {
    id: 'space-explorer',
    name: 'Explorador Espacial',
    description: 'Construiu uma criação com tema espacial',
    icon: '🚀',
    color: '#006DB7',
    earnedAt: '2024-02-01T09:15:00Z',
    isEarned: true,
  },
  {
    id: 'master-architect',
    name: 'Mestre Arquiteto',
    description: 'Alcançou o Nível 3 de Construtor',
    icon: '🏆',
    color: '#D01012',
    earnedAt: '2024-02-10T16:45:00Z',
    isEarned: true,
  },
  {
    id: 'brick-collector',
    name: 'Colecionador de Peças',
    description: 'Tem mais de 500 peças',
    icon: '📦',
    color: '#4D924A',
    earnedAt: '',
    isEarned: false,
  },
  {
    id: 'story-teller',
    name: 'Contador de Histórias',
    description: 'Gerou 5 histórias com IA para suas criações',
    icon: '📖',
    color: '#FF6B00',
    earnedAt: '',
    isEarned: false,
  },
  {
    id: 'team-player',
    name: 'Trabalho em Equipe',
    description: 'Compartilhou uma criação com um amigo',
    icon: '🤝',
    color: '#006DB7',
    earnedAt: '',
    isEarned: false,
  },
  {
    id: 'daily-builder',
    name: 'Construtor Diário',
    description: 'Complete 7 missões diárias seguidas',
    icon: '📅',
    color: '#FFCC00',
    earnedAt: '',
    isEarned: false,
  },
];

const DEMO_QUEST: DailyQuest = {
  id: 'quest-wings',
  title: 'Asas da Maravilha',
  description: 'Construa algo com asas hoje! Pode ser um avião, um dragão ou uma criatura mágica! ✨',
  xpReward: 150,
  progress: 0,
  total: 1,
  isCompleted: false,
  icon: '🦋',
};

const DEMO_CREATIONS: Creation[] = [
  {
    id: 'creation-1',
    name: 'Estação Espacial Alfa Cósmica',
    description: 'Uma poderosa estação espacial orbitando o planeta Brickoria',
    imageUrl: '/placeholder-space-station.jpg',
    story: 'No ano 3024, o jovem Comandante Benjamim lançou a Estação Espacial Alfa ao cosmos. Construída com 247 preciosas peças coletadas de sete galáxias, ela se tornou o centro de exploração intergaláctica de LEGO. Cientistas de todo o universo vieram estudar seus magníficos painéis solares amarelos e torres de comunicação azuis...',
    bricksUsed: 247,
    createdAt: '2024-02-10T14:00:00Z',
    tags: ['espaço', 'ficção científica', 'grande'],
    likes: 42,
  },
  {
    id: 'creation-2',
    name: 'Castelo da Toca do Dragão',
    description: 'Uma épica fortaleza medieval protegida pelo amigável dragão Bricky',
    imageUrl: '/placeholder-castle.jpg',
    story: 'Nas profundezas das Montanhas de Peças vivia um dragão amigável chamado Bricky que guardava um magnífico castelo. Construído com 183 peças vermelhas e cinzas mágicas, o castelo tinha sete torres e uma ponte levadiça feita de peças transparentes especiais. Toda noite, Bricky iluminava as janelas amarelas com seu bafo quente de dragão...',
    bricksUsed: 183,
    createdAt: '2024-01-28T10:30:00Z',
    tags: ['fantasia', 'medieval', 'castelo'],
    likes: 38,
  },
  {
    id: 'creation-3',
    name: 'Cidade da Ponte Arco-íris',
    description: 'Uma cidade colorida conectada por uma incrível ponte arco-íris',
    imageUrl: '/placeholder-city.jpg',
    story: 'Na terra mágica de BrickVille, a Cidade da Ponte Arco-íris era o lugar mais colorido imaginável. Benjamim usou cada cor da sua coleção — 12 cores no total — para construir esta metrópole espetacular. A própria ponte continha 89 peças em perfeita ordem de arco-íris, e minúsculos cidadãos de LEGO a atravessavam todos os dias...',
    bricksUsed: 312,
    createdAt: '2024-01-15T09:00:00Z',
    tags: ['cidade', 'colorido', 'ponte'],
    likes: 55,
  },
];

const DEMO_BUILD_IDEAS: BuildIdea[] = [
  {
    id: 'idea-1',
    title: 'Estação Espacial Cósmica',
    description: 'Construa uma incrível estação espacial com painéis solares, docas de ancoragem e decks de observação! Perfeita para a sua conquista de explorador espacial.',
    difficulty: 'hard',
    theme: 'Espaço',
    estimatedParts: 180,
    matchPercentage: 94,
    imageUrl: '/placeholder-space-station.jpg',
    tags: ['espaço', 'ficção científica', 'grande'],
    timeEstimate: '2-3 horas',
  },
  {
    id: 'idea-2',
    title: 'Castelo da Toca do Dragão',
    description: 'Crie um magnífico castelo medieval com torres, uma caverna de dragão e uma sala de tesouro secreta!',
    difficulty: 'medium',
    theme: 'Fantasia',
    estimatedParts: 120,
    matchPercentage: 87,
    imageUrl: '/placeholder-castle.jpg',
    tags: ['fantasia', 'medieval', 'castelo'],
    timeEstimate: '1-2 horas',
  },
  {
    id: 'idea-3',
    title: 'Ponte Arco-íris',
    description: 'Construa uma deslumbrante ponte arco-íris conectando duas ilhas coloridas usando todas as cores da sua coleção!',
    difficulty: 'easy',
    theme: 'Fantasia',
    estimatedParts: 85,
    matchPercentage: 98,
    imageUrl: '/placeholder-bridge.jpg',
    tags: ['colorido', 'ponte', 'natureza'],
    timeEstimate: '45 min',
  },
  {
    id: 'idea-4',
    title: 'Submarino Subaquático',
    description: 'Mergulhe fundo com um submarino amarelo com periscópio, propulsores e uma cabine para a tripulação!',
    difficulty: 'medium',
    theme: 'Oceano',
    estimatedParts: 95,
    matchPercentage: 82,
    imageUrl: '/placeholder-submarine.jpg',
    tags: ['oceano', 'veículo', 'amarelo'],
    timeEstimate: '1 hora',
  },
  {
    id: 'idea-5',
    title: 'Fábrica de Robôs',
    description: 'Projete sua própria linha de montagem de robôs! Construa robôs fofos de diferentes tamanhos com braços móveis e olhos piscando.',
    difficulty: 'hard',
    theme: 'Ficção Científica',
    estimatedParts: 210,
    matchPercentage: 76,
    imageUrl: '/placeholder-robot.jpg',
    tags: ['robôs', 'fábrica', 'ficção científica'],
    timeEstimate: '3-4 horas',
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
      user: DEMO_USER,
      badges: DEMO_BADGES,
      dailyQuest: DEMO_QUEST,
      creations: DEMO_CREATIONS,
      buildIdeas: DEMO_BUILD_IDEAS,
      isBuddyOpen: false,
      isParentMode: false,
      isParentAuthenticated: false,
      theme: 'light',

      toggleBuddy: () => set((state) => ({ isBuddyOpen: !state.isBuddyOpen })),
      closeBuddy: () => set({ isBuddyOpen: false }),
      openBuddy: () => set({ isBuddyOpen: true }),

      completeQuest: () => {
        set((state) => ({
          dailyQuest: { ...state.dailyQuest, isCompleted: true, progress: state.dailyQuest.total },
          user: {
            ...state.user,
            xp: state.user.xp + state.dailyQuest.xpReward,
          },
        }));
      },

      updateXP: (amount: number) => {
        set((state) => {
          const newXP = state.user.xp + amount;
          const newLevel = newXP >= state.user.xpToNextLevel
            ? state.user.level + 1
            : state.user.level;
          return {
            user: {
              ...state.user,
              xp: newXP,
              level: newLevel,
            },
          };
        });
      },

      unlockBadge: (badgeId: string) => {
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === badgeId
              ? { ...b, isEarned: true, earnedAt: new Date().toISOString() }
              : b
          ),
        }));
      },

      addCreation: (creation: Omit<Creation, 'id' | 'createdAt'>) => {
        const newCreation: Creation = {
          ...creation,
          id: `creation-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          creations: [newCreation, ...state.creations],
        }));
      },

      authenticateParent: (pin: string) => {
        if (pin === '1234') {
          set({ isParentAuthenticated: true, isParentMode: true });
          return true;
        }
        return false;
      },

      setParentMode: (mode: boolean) => {
        set({ isParentMode: mode });
        if (!mode) {
          set({ isParentAuthenticated: false });
        }
      },
    }),
    {
      name: 'brickverse-app',
      partialize: (state) => ({
        user: state.user,
        badges: state.badges,
        dailyQuest: state.dailyQuest,
        creations: state.creations,
        theme: state.theme,
      }),
    }
  )
);
