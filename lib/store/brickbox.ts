import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LegoColor {
  id: number;
  name: string;
  rgb: string;
  isTransparent: boolean;
}

export interface BrickEntry {
  partNum: string;
  name: string;
  colorId: number;
  colorName: string;
  colorRgb: string;
  quantity: number;
  imageUrl?: string;
  categoryId?: number;
  categoryName?: string;
}

export interface OwnedSet {
  setNum: string;
  name: string;
  year: number;
  theme: string;
  numParts: number;
  imageUrl: string;
  addedAt: string;
}

export interface BrickBoxStats {
  totalBricks: number;
  totalSets: number;
  totalColors: number;
  totalCreations: number;
}

interface BrickBoxState {
  inventory: BrickEntry[];
  ownedSets: OwnedSet[];
  isLoading: boolean;
  addSet: (set: OwnedSet, bricks?: BrickEntry[]) => void;
  removeSet: (setNum: string) => void;
  addBrick: (brick: Omit<BrickEntry, 'quantity'>, qty: number) => void;
  removeBrick: (partNum: string, colorId: number, qty: number) => void;
  getStats: () => BrickBoxStats;
  getBricksByColor: () => Record<string, BrickEntry[]>;
  setLoading: (loading: boolean) => void;
  initDemoData: () => void;
}

const DEMO_SETS: OwnedSet[] = [
  {
    setNum: '10497-1',
    name: 'Galaxy Explorer',
    year: 2022,
    theme: 'Classic',
    numParts: 1254,
    imageUrl: 'https://cdn.rebrickable.com/media/sets/10497-1/85977.jpg',
    addedAt: new Date().toISOString(),
  },
  {
    setNum: '60316-1',
    name: 'City Police Station',
    year: 2022,
    theme: 'City',
    numParts: 668,
    imageUrl: 'https://cdn.rebrickable.com/media/sets/60316-1/88003.jpg',
    addedAt: new Date().toISOString(),
  },
  {
    setNum: '42108-1',
    name: 'Mobile Crane MK II',
    year: 2020,
    theme: 'Technic',
    numParts: 1292,
    imageUrl: 'https://cdn.rebrickable.com/media/sets/42108-1/52474.jpg',
    addedAt: new Date().toISOString(),
  },
];

const DEMO_INVENTORY: BrickEntry[] = [
  { partNum: '3001', name: '2x4 Brick', colorId: 4, colorName: 'Red', colorRgb: 'C91A09', quantity: 48 },
  { partNum: '3001', name: '2x4 Brick', colorId: 1, colorName: 'Blue', colorRgb: '0055BF', quantity: 36 },
  { partNum: '3001', name: '2x4 Brick', colorId: 14, colorName: 'Yellow', colorRgb: 'F2CD37', quantity: 52 },
  { partNum: '3001', name: '2x4 Brick', colorId: 2, colorName: 'Green', colorRgb: '237841', quantity: 31 },
  { partNum: '3001', name: '2x4 Brick', colorId: 15, colorName: 'White', colorRgb: 'FFFFFF', quantity: 44 },
  { partNum: '3001', name: '2x4 Brick', colorId: 0, colorName: 'Black', colorRgb: '05131D', quantity: 28 },
  { partNum: '3002', name: '2x3 Brick', colorId: 4, colorName: 'Red', colorRgb: 'C91A09', quantity: 24 },
  { partNum: '3002', name: '2x3 Brick', colorId: 1, colorName: 'Blue', colorRgb: '0055BF', quantity: 18 },
  { partNum: '3003', name: '2x2 Brick', colorId: 14, colorName: 'Yellow', colorRgb: 'F2CD37', quantity: 40 },
  { partNum: '3003', name: '2x2 Brick', colorId: 2, colorName: 'Green', colorRgb: '237841', quantity: 22 },
  { partNum: '3003', name: '2x2 Brick', colorId: 15, colorName: 'White', colorRgb: 'FFFFFF', quantity: 35 },
  { partNum: '3004', name: '1x2 Brick', colorId: 4, colorName: 'Red', colorRgb: 'C91A09', quantity: 60 },
  { partNum: '3004', name: '1x2 Brick', colorId: 1, colorName: 'Blue', colorRgb: '0055BF', quantity: 45 },
  { partNum: '3004', name: '1x2 Brick', colorId: 25, colorName: 'Orange', colorRgb: 'FE8A18', quantity: 30 },
  { partNum: '3005', name: '1x1 Brick', colorId: 4, colorName: 'Red', colorRgb: 'C91A09', quantity: 80 },
  { partNum: '3005', name: '1x1 Brick', colorId: 14, colorName: 'Yellow', colorRgb: 'F2CD37', quantity: 65 },
  { partNum: '3034', name: '2x8 Plate', colorId: 2, colorName: 'Green', colorRgb: '237841', quantity: 12 },
  { partNum: '3034', name: '2x8 Plate', colorId: 15, colorName: 'White', colorRgb: 'FFFFFF', quantity: 8 },
  { partNum: '3020', name: '2x4 Plate', colorId: 15, colorName: 'White', colorRgb: 'FFFFFF', quantity: 20 },
  { partNum: '3020', name: '2x4 Plate', colorId: 4, colorName: 'Red', colorRgb: 'C91A09', quantity: 15 },
  { partNum: '3794', name: '1x2 Plate with rail', colorId: 0, colorName: 'Black', colorRgb: '05131D', quantity: 25 },
  { partNum: '3176', name: '3x2 Plate with hole', colorId: 9, colorName: 'Light Gray', colorRgb: '9BA19D', quantity: 14 },
  { partNum: '3823', name: '1x4 Plate', colorId: 14, colorName: 'Yellow', colorRgb: 'F2CD37', quantity: 18 },
  { partNum: '3031', name: '4x4 Plate', colorId: 1, colorName: 'Blue', colorRgb: '0055BF', quantity: 10 },
];

export const useBrickBoxStore = create<BrickBoxState>()(
  persist(
    (set, get) => ({
      inventory: [],
      ownedSets: [],
      isLoading: false,

      addSet: (newSet: OwnedSet, bricks?: BrickEntry[]) => {
        set((state) => {
          const alreadyOwned = state.ownedSets.some((s) => s.setNum === newSet.setNum);
          if (alreadyOwned) return state;

          const updatedInventory = bricks
            ? [...state.inventory, ...bricks]
            : state.inventory;

          return {
            ownedSets: [...state.ownedSets, newSet],
            inventory: updatedInventory,
          };
        });
      },

      removeSet: (setNum: string) => {
        set((state) => ({
          ownedSets: state.ownedSets.filter((s) => s.setNum !== setNum),
        }));
      },

      addBrick: (brick: Omit<BrickEntry, 'quantity'>, qty: number) => {
        set((state) => {
          const existing = state.inventory.find(
            (b) => b.partNum === brick.partNum && b.colorId === brick.colorId
          );

          if (existing) {
            return {
              inventory: state.inventory.map((b) =>
                b.partNum === brick.partNum && b.colorId === brick.colorId
                  ? { ...b, quantity: b.quantity + qty }
                  : b
              ),
            };
          }

          return {
            inventory: [...state.inventory, { ...brick, quantity: qty }],
          };
        });
      },

      removeBrick: (partNum: string, colorId: number, qty: number) => {
        set((state) => ({
          inventory: state.inventory
            .map((b) =>
              b.partNum === partNum && b.colorId === colorId
                ? { ...b, quantity: Math.max(0, b.quantity - qty) }
                : b
            )
            .filter((b) => b.quantity > 0),
        }));
      },

      getStats: () => {
        const { inventory, ownedSets } = get();
        const totalBricks = inventory.reduce((sum, b) => sum + b.quantity, 0);
        const colors = new Set(inventory.map((b) => b.colorId));
        return {
          totalBricks,
          totalSets: ownedSets.length,
          totalColors: colors.size,
          totalCreations: 3,
        };
      },

      getBricksByColor: () => {
        const { inventory } = get();
        return inventory.reduce<Record<string, BrickEntry[]>>((acc, brick) => {
          const key = brick.colorName;
          if (!acc[key]) acc[key] = [];
          acc[key].push(brick);
          return acc;
        }, {});
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      initDemoData: () => {
        set({
          ownedSets: DEMO_SETS,
          inventory: DEMO_INVENTORY,
        });
      },
    }),
    {
      name: 'brickverse-inventory',
    }
  )
);
