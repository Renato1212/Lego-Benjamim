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
  levelName: 'Architect',
  xp: 2340,
  xpToNextLevel: 3000,
};

const DEMO_BADGES: Badge[] = [
  {
    id: 'first-build',
    name: 'First Build',
    description: 'Completed your very first creation!',
    icon: '🏗️',
    color: '#FFCC00',
    earnedAt: '2024-01-15T10:00:00Z',
    isEarned: true,
  },
  {
    id: 'color-wizard',
    name: 'Color Wizard',
    description: 'Used 10 different colors in one creation',
    icon: '🌈',
    color: '#7B2D8B',
    earnedAt: '2024-01-20T14:30:00Z',
    isEarned: true,
  },
  {
    id: 'space-explorer',
    name: 'Space Explorer',
    description: 'Built a space-themed creation',
    icon: '🚀',
    color: '#006DB7',
    earnedAt: '2024-02-01T09:15:00Z',
    isEarned: true,
  },
  {
    id: 'master-architect',
    name: 'Master Architect',
    description: 'Reached Level 3 Builder status',
    icon: '🏆',
    color: '#D01012',
    earnedAt: '2024-02-10T16:45:00Z',
    isEarned: true,
  },
  {
    id: 'brick-collector',
    name: 'Brick Collector',
    description: 'Own more than 500 bricks',
    icon: '📦',
    color: '#4D924A',
    earnedAt: '',
    isEarned: false,
  },
  {
    id: 'story-teller',
    name: 'Story Teller',
    description: 'Generate 5 AI stories for your creations',
    icon: '📖',
    color: '#FF6B00',
    earnedAt: '',
    isEarned: false,
  },
  {
    id: 'team-player',
    name: 'Team Player',
    description: 'Share a creation with a friend',
    icon: '🤝',
    color: '#006DB7',
    earnedAt: '',
    isEarned: false,
  },
  {
    id: 'daily-builder',
    name: 'Daily Builder',
    description: 'Complete 7 daily quests in a row',
    icon: '📅',
    color: '#FFCC00',
    earnedAt: '',
    isEarned: false,
  },
];

const DEMO_QUEST: DailyQuest = {
  id: 'quest-wings',
  title: 'Wings of Wonder',
  description: 'Build something with wings today! It could be a plane, a dragon, or a magical creature! ✨',
  xpReward: 150,
  progress: 0,
  total: 1,
  isCompleted: false,
  icon: '🦋',
};

const DEMO_CREATIONS: Creation[] = [
  {
    id: 'creation-1',
    name: 'Cosmic Space Station Alpha',
    description: 'A mighty space station orbiting the planet Brickoria',
    imageUrl: '/placeholder-space-station.jpg',
    story: 'Far in the year 3024, young Commander Benjamim launched Space Station Alpha into the cosmos. Built from 247 precious bricks collected from seven galaxies, it became the hub of intergalactic LEGO exploration. Scientists from across the universe came to study its magnificent yellow solar panels and blue communication towers...',
    bricksUsed: 247,
    createdAt: '2024-02-10T14:00:00Z',
    tags: ['space', 'sci-fi', 'large'],
    likes: 42,
  },
  {
    id: 'creation-2',
    name: "Dragon's Lair Castle",
    description: 'An epic medieval fortress protected by the friendly dragon Bricky',
    imageUrl: '/placeholder-castle.jpg',
    story: 'Deep in the Brick Mountains lived a friendly dragon named Bricky who guarded a magnificent castle. Built with 183 magical red and grey bricks, the castle had seven towers and a drawbridge made of special transparent pieces. Every night, Bricky would light up the yellow windows with warm dragon breath...',
    bricksUsed: 183,
    createdAt: '2024-01-28T10:30:00Z',
    tags: ['fantasy', 'medieval', 'castle'],
    likes: 38,
  },
  {
    id: 'creation-3',
    name: 'Rainbow Bridge City',
    description: 'A colorful city connected by an amazing rainbow bridge',
    imageUrl: '/placeholder-city.jpg',
    story: 'In the magical land of BrickVille, the Rainbow Bridge City was the most colorful place imaginable. Benjamim used every single color in his collection - 12 colors total - to build this spectacular metropolis. The bridge itself contained 89 bricks in perfect rainbow order, and tiny LEGO citizens traveled across it every day...',
    bricksUsed: 312,
    createdAt: '2024-01-15T09:00:00Z',
    tags: ['city', 'colorful', 'bridge'],
    likes: 55,
  },
];

const DEMO_BUILD_IDEAS: BuildIdea[] = [
  {
    id: 'idea-1',
    title: 'Cosmic Space Station',
    description: 'Build an amazing space station with solar panels, docking bays, and observation decks! Perfect for your space explorer badge.',
    difficulty: 'hard',
    theme: 'Space',
    estimatedParts: 180,
    matchPercentage: 94,
    imageUrl: '/placeholder-space-station.jpg',
    tags: ['space', 'sci-fi', 'large'],
    timeEstimate: '2-3 hours',
  },
  {
    id: 'idea-2',
    title: "Dragon's Lair Castle",
    description: 'Create a magnificent medieval castle with towers, a dragon cave, and a secret treasure room!',
    difficulty: 'medium',
    theme: 'Fantasy',
    estimatedParts: 120,
    matchPercentage: 87,
    imageUrl: '/placeholder-castle.jpg',
    tags: ['fantasy', 'medieval', 'castle'],
    timeEstimate: '1-2 hours',
  },
  {
    id: 'idea-3',
    title: 'Rainbow Bridge',
    description: 'Build a stunning rainbow bridge connecting two colorful islands using all the colors in your collection!',
    difficulty: 'easy',
    theme: 'Fantasy',
    estimatedParts: 85,
    matchPercentage: 98,
    imageUrl: '/placeholder-bridge.jpg',
    tags: ['colorful', 'bridge', 'nature'],
    timeEstimate: '45 min',
  },
  {
    id: 'idea-4',
    title: 'Underwater Submarine',
    description: 'Dive deep with a cool yellow submarine that has periscopes, propellers, and a tiny crew cabin!',
    difficulty: 'medium',
    theme: 'Ocean',
    estimatedParts: 95,
    matchPercentage: 82,
    imageUrl: '/placeholder-submarine.jpg',
    tags: ['ocean', 'vehicle', 'yellow'],
    timeEstimate: '1 hour',
  },
  {
    id: 'idea-5',
    title: 'Robot Factory',
    description: 'Engineer your own robot assembly line! Build cute robots of different sizes with moving arms and blinking eyes.',
    difficulty: 'hard',
    theme: 'Sci-Fi',
    estimatedParts: 210,
    matchPercentage: 76,
    imageUrl: '/placeholder-robot.jpg',
    tags: ['robots', 'factory', 'sci-fi'],
    timeEstimate: '3-4 hours',
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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
