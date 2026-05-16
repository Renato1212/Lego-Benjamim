const REBRICKABLE_BASE = 'https://rebrickable.com/api/v3/lego';

interface RebrickableSet {
  set_num: string;
  name: string;
  year: number;
  theme_id: number;
  num_parts: number;
  set_img_url: string;
  set_url: string;
  last_modified_dt: string;
}

interface RebrickableSetPart {
  id: number;
  inv_part_id: number;
  part: {
    part_num: string;
    name: string;
    part_cat_id: number;
    part_url: string;
    part_img_url: string | null;
  };
  color: {
    id: number;
    name: string;
    rgb: string;
    is_trans: boolean;
  };
  set_num: string;
  quantity: number;
  is_spare: boolean;
}

interface RebrickableSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RebrickableSet[];
}

interface RebrickablePartsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RebrickableSetPart[];
}

export interface NormalizedSet {
  setNum: string;
  name: string;
  year: number;
  themeId: number;
  numParts: number;
  imageUrl: string;
  setUrl: string;
}

export interface NormalizedPart {
  partNum: string;
  name: string;
  colorId: number;
  colorName: string;
  colorRgb: string;
  isTransparent: boolean;
  quantity: number;
  imageUrl: string | null;
  categoryId: number;
}

const getHeaders = () => ({
  Authorization: `key ${process.env.REBRICKABLE_API_KEY}`,
  Accept: 'application/json',
});

export async function searchSets(query: string, page = 1): Promise<NormalizedSet[]> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return DEMO_SETS.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.setNum.includes(query)
    );
  }

  const url = `${REBRICKABLE_BASE}/sets/?search=${encodeURIComponent(query)}&page=${page}&page_size=20&ordering=-year`;
  const response = await fetch(url, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error(`Rebrickable API error: ${response.status}`);
  }

  const data: RebrickableSearchResponse = await response.json();

  return data.results.map((set) => ({
    setNum: set.set_num,
    name: set.name,
    year: set.year,
    themeId: set.theme_id,
    numParts: set.num_parts,
    imageUrl: set.set_img_url || '',
    setUrl: set.set_url,
  }));
}

export async function getSetParts(setNum: string): Promise<NormalizedPart[]> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return DEMO_PARTS;
  }

  const url = `${REBRICKABLE_BASE}/sets/${setNum}/parts/?page_size=1000`;
  const response = await fetch(url, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error(`Rebrickable API error: ${response.status}`);
  }

  const data: RebrickablePartsResponse = await response.json();

  return data.results
    .filter((p) => !p.is_spare)
    .map((p) => ({
      partNum: p.part.part_num,
      name: p.part.name,
      colorId: p.color.id,
      colorName: p.color.name,
      colorRgb: p.color.rgb,
      isTransparent: p.color.is_trans,
      quantity: p.quantity,
      imageUrl: p.part.part_img_url,
      categoryId: p.part.part_cat_id,
    }));
}

export async function getSetDetails(setNum: string): Promise<NormalizedSet | null> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return DEMO_SETS.find((s) => s.setNum === setNum) || null;
  }

  const url = `${REBRICKABLE_BASE}/sets/${setNum}/`;
  const response = await fetch(url, { headers: getHeaders() });

  if (!response.ok) {
    return null;
  }

  const set: RebrickableSet = await response.json();

  return {
    setNum: set.set_num,
    name: set.name,
    year: set.year,
    themeId: set.theme_id,
    numParts: set.num_parts,
    imageUrl: set.set_img_url || '',
    setUrl: set.set_url,
  };
}

// Demo data for mock mode
const DEMO_SETS: NormalizedSet[] = [
  {
    setNum: '10497-1',
    name: 'Galaxy Explorer',
    year: 2022,
    themeId: 52,
    numParts: 1254,
    imageUrl: 'https://cdn.rebrickable.com/media/sets/10497-1/85977.jpg',
    setUrl: 'https://rebrickable.com/sets/10497-1/',
  },
  {
    setNum: '60316-1',
    name: 'City Police Station',
    year: 2022,
    themeId: 67,
    numParts: 668,
    imageUrl: 'https://cdn.rebrickable.com/media/sets/60316-1/88003.jpg',
    setUrl: 'https://rebrickable.com/sets/60316-1/',
  },
  {
    setNum: '42108-1',
    name: 'Mobile Crane MK II',
    year: 2020,
    themeId: 158,
    numParts: 1292,
    imageUrl: 'https://cdn.rebrickable.com/media/sets/42108-1/52474.jpg',
    setUrl: 'https://rebrickable.com/sets/42108-1/',
  },
  {
    setNum: '75341-1',
    name: 'The Mandalorian\'s N-1 Starfighter',
    year: 2022,
    themeId: 171,
    numParts: 1023,
    imageUrl: 'https://cdn.rebrickable.com/media/sets/75341-1/91861.jpg',
    setUrl: 'https://rebrickable.com/sets/75341-1/',
  },
  {
    setNum: '21052-1',
    name: 'Dubai',
    year: 2020,
    themeId: 88,
    numParts: 740,
    imageUrl: 'https://cdn.rebrickable.com/media/sets/21052-1/55284.jpg',
    setUrl: 'https://rebrickable.com/sets/21052-1/',
  },
];

const DEMO_PARTS: NormalizedPart[] = [
  { partNum: '3001', name: '2x4 Brick', colorId: 4, colorName: 'Red', colorRgb: 'C91A09', isTransparent: false, quantity: 12, imageUrl: null, categoryId: 1 },
  { partNum: '3001', name: '2x4 Brick', colorId: 1, colorName: 'Blue', colorRgb: '0055BF', isTransparent: false, quantity: 8, imageUrl: null, categoryId: 1 },
  { partNum: '3003', name: '2x2 Brick', colorId: 14, colorName: 'Yellow', colorRgb: 'F2CD37', isTransparent: false, quantity: 10, imageUrl: null, categoryId: 1 },
  { partNum: '3005', name: '1x1 Brick', colorId: 15, colorName: 'White', colorRgb: 'FFFFFF', isTransparent: false, quantity: 20, imageUrl: null, categoryId: 1 },
];
