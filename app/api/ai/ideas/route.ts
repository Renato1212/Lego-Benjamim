import { NextRequest, NextResponse } from 'next/server';

const DEMO_IDEAS = [
  {
    id: 'idea-gen-1',
    title: 'Cosmic Space Station',
    description: 'Build an amazing space station with solar panels, docking bays, and observation decks!',
    difficulty: 'hard',
    theme: 'Space',
    estimatedParts: 180,
    matchPercentage: 94,
    tags: ['space', 'sci-fi', 'large'],
    timeEstimate: '2-3 hours',
  },
  {
    id: 'idea-gen-2',
    title: "Dragon's Lair Castle",
    description: 'Create a magnificent medieval castle with towers, a dragon cave, and a secret treasure room!',
    difficulty: 'medium',
    theme: 'Fantasy',
    estimatedParts: 120,
    matchPercentage: 87,
    tags: ['fantasy', 'medieval', 'castle'],
    timeEstimate: '1-2 hours',
  },
  {
    id: 'idea-gen-3',
    title: 'Rainbow Bridge',
    description: 'Build a stunning rainbow bridge connecting two colorful islands!',
    difficulty: 'easy',
    theme: 'Fantasy',
    estimatedParts: 85,
    matchPercentage: 98,
    tags: ['colorful', 'bridge', 'nature'],
    timeEstimate: '45 min',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inventory, theme, difficulty } = body;

    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      await new Promise((r) => setTimeout(r, 1200));

      const filtered = DEMO_IDEAS.filter((idea) => {
        if (difficulty && difficulty !== 'all' && idea.difficulty !== difficulty) return false;
        if (theme && theme !== 'all' && idea.theme !== theme) return false;
        return true;
      });

      return NextResponse.json({ ideas: filtered.length ? filtered : DEMO_IDEAS });
    }

    const { generateBuildIdeas } = await import('@/lib/ai/claude');
    const inventoryStr = typeof inventory === 'string' ? inventory : JSON.stringify(inventory);
    const ideasText = await generateBuildIdeas(inventoryStr, theme, difficulty);

    // Try to parse JSON from Claude's response
    const jsonMatch = ideasText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ ideas: DEMO_IDEAS });
    }

    const ideas = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('Ideas generation error:', error);
    return NextResponse.json({ ideas: DEMO_IDEAS }, { status: 500 });
  }
}
