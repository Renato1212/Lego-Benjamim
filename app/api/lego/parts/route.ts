import { NextRequest, NextResponse } from 'next/server';
import { getSetParts } from '@/lib/legoSources/rebrickable';

const DEMO_PARTS = [
  { partNum: '3001', name: '2x4 Brick', colorId: 4, colorName: 'Red', colorRgb: 'C91A09', quantity: 12 },
  { partNum: '3001', name: '2x4 Brick', colorId: 1, colorName: 'Blue', colorRgb: '0055BF', quantity: 8 },
  { partNum: '3003', name: '2x2 Brick', colorId: 14, colorName: 'Yellow', colorRgb: 'F2CD37', quantity: 10 },
  { partNum: '3005', name: '1x1 Brick', colorId: 15, colorName: 'White', colorRgb: 'FFFFFF', quantity: 20 },
  { partNum: '3034', name: '2x8 Plate', colorId: 2, colorName: 'Green', colorRgb: '237841', quantity: 5 },
  { partNum: '3020', name: '2x4 Plate', colorId: 4, colorName: 'Red', colorRgb: 'C91A09', quantity: 8 },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const setNum = searchParams.get('setNum') || '';

  if (!setNum) {
    return NextResponse.json(
      { error: 'Set number is required', parts: [] },
      { status: 400 }
    );
  }

  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    // Return demo parts with a slight delay to simulate loading
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ parts: DEMO_PARTS, setNum });
  }

  try {
    const parts = await getSetParts(setNum);
    return NextResponse.json({ parts, setNum });
  } catch (error) {
    console.error('Parts fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parts', parts: [] },
      { status: 500 }
    );
  }
}
