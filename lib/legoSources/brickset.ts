const BRICKSET_BASE = 'https://brickset.com/api/v3.asmx';

interface BricksetSet {
  setID: number;
  number: string;
  numberVariant: number;
  name: string;
  year: number;
  theme: string;
  themeGroup: string;
  subtheme: string;
  pieces: number;
  image: {
    thumbnailURL: string;
    imageURL: string;
  };
  rating: number;
  reviewCount: number;
  instructionsCount: number;
}

interface BricksetResponse {
  status: string;
  message: string;
  matches: number;
  sets: BricksetSet[];
}

export interface BricksetNormalizedSet {
  setNum: string;
  name: string;
  year: number;
  theme: string;
  subtheme: string;
  numParts: number;
  imageUrl: string;
  rating: number;
}

function buildBricksetUrl(method: string, params: Record<string, string>): string {
  const searchParams = new URLSearchParams({
    apiKey: process.env.BRICKSET_API_KEY || '',
    userHash: '',
    ...params,
  });
  return `${BRICKSET_BASE}/${method}?${searchParams.toString()}`;
}

export async function searchBricksetSets(query: string): Promise<BricksetNormalizedSet[]> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return DEMO_BRICKSET_SETS.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  const url = buildBricksetUrl('getSets', {
    params: JSON.stringify({
      query,
      pageSize: 20,
      orderBy: 'Pieces',
    }),
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Brickset API error: ${response.status}`);
  }

  const data: BricksetResponse = await response.json();

  if (data.status !== 'success') {
    throw new Error(`Brickset API error: ${data.message}`);
  }

  return data.sets.map((set) => ({
    setNum: `${set.number}-${set.numberVariant}`,
    name: set.name,
    year: set.year,
    theme: set.theme,
    subtheme: set.subtheme || '',
    numParts: set.pieces || 0,
    imageUrl: set.image?.imageURL || set.image?.thumbnailURL || '',
    rating: set.rating || 0,
  }));
}

export async function getBricksetThemes(): Promise<string[]> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return [
      'City', 'Technic', 'Creator', 'Star Wars', 'Harry Potter',
      'Minecraft', 'NINJAGO', 'Friends', 'Classic', 'Architecture',
      'Ideas', 'Speed Champions', 'Icons', 'Botanical Collection',
    ];
  }

  const url = buildBricksetUrl('getThemes', {});
  const response = await fetch(url);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.themes?.map((t: { theme: string }) => t.theme) || [];
}

const DEMO_BRICKSET_SETS: BricksetNormalizedSet[] = [
  {
    setNum: '10497-1',
    name: 'Galaxy Explorer',
    year: 2022,
    theme: 'Classic',
    subtheme: 'Space',
    numParts: 1254,
    imageUrl: 'https://images.brickset.com/sets/images/10497-1.jpg',
    rating: 4.8,
  },
  {
    setNum: '60316-1',
    name: 'City Police Station',
    year: 2022,
    theme: 'City',
    subtheme: 'Police',
    numParts: 668,
    imageUrl: 'https://images.brickset.com/sets/images/60316-1.jpg',
    rating: 4.5,
  },
  {
    setNum: '42108-1',
    name: 'Mobile Crane MK II',
    year: 2020,
    theme: 'Technic',
    subtheme: '',
    numParts: 1292,
    imageUrl: 'https://images.brickset.com/sets/images/42108-1.jpg',
    rating: 4.7,
  },
];
