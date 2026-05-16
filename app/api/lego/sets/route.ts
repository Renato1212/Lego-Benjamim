import { NextRequest, NextResponse } from 'next/server';
import { searchSets } from '@/lib/legoSources/rebrickable';

const DEMO_SETS = [
  {
    setNum: '10497-1',
    name: 'Galaxy Explorer',
    year: 2022,
    numParts: 1254,
    imageUrl: 'https://cdn.rebrickable.com/media/sets/10497-1/85977.jpg',
    theme: 'Classic',
  },
  {
    setNum: '60316-1',
    name: 'City Police Station',
    year: 2022,
    numParts: 668,
    imageUrl: 'https://cdn.rebrickable.com/media/sets/60316-1/88003.jpg',
    theme: 'City',
  },
  {
    setNum: '42108-1',
    name: 'Mobile Crane MK II',
    year: 2020,
    numParts: 1292,
    imageUrl: 'https://cdn.rebrickable.com/media/sets/42108-1/52474.jpg',
    theme: 'Technic',
  },
  {
    setNum: '75341-1',
    name: "The Mandalorian's N-1 Starfighter",
    year: 2022,
    numParts: 1023,
    imageUrl: '',
    theme: 'Star Wars',
  },
  {
    setNum: '21052-1',
    name: 'Dubai Architecture',
    year: 2020,
    numParts: 740,
    imageUrl: '',
    theme: 'Architecture',
  },
  {
    setNum: '31120-1',
    name: 'Medieval Castle',
    year: 2021,
    numParts: 1426,
    imageUrl: '',
    theme: 'Creator',
  },
  {
    setNum: '10275-1',
    name: 'Elf Club House',
    year: 2020,
    numParts: 1197,
    imageUrl: '',
    theme: 'Creator Expert',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    const filtered = query
      ? DEMO_SETS.filter(
          (s) =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.setNum.includes(query) ||
            (s.theme && s.theme.toLowerCase().includes(query.toLowerCase()))
        )
      : DEMO_SETS;

    return NextResponse.json({ sets: filtered, total: filtered.length });
  }

  try {
    const sets = await searchSets(query, page);
    return NextResponse.json({ sets, total: sets.length });
  } catch (error) {
    console.error('Rebrickable search error:', error);
    return NextResponse.json(
      { error: 'Failed to search sets', sets: [] },
      { status: 500 }
    );
  }
}
