import { NextRequest, NextResponse } from 'next/server';

const DEMO_STORIES = [
  "Far in the year 3024, young Commander Benjamim launched their incredible creation into the cosmos! Built from precious bricks collected across seven galaxies, it became the hub of intergalactic LEGO exploration. Scientists from across the universe came to marvel at its magnificent design, and even the great Brick Council declared it the finest achievement in history!",
  "Deep in the enchanted Brick Mountains lived a creation so magnificent that dragons bowed before it! Built with 183 magical bricks in the most brilliant colors imaginable, it glowed with the light of a thousand sunsets. Every night, the local villagers would gather around it, telling stories of how brave Benjamim built it in a single legendary afternoon!",
  "In the magical land of BrickVille, this extraordinary creation was the most colorful wonder ever seen! Benjamim used every single color in their collection - 12 colors total - to create this spectacular masterpiece. The Rainbow Council awarded it the Golden Stud Award, the highest honor in all of BrickVille!",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { creationName, creationDescription, bricksUsed, colors } = body;

    if (!creationName) {
      return NextResponse.json(
        { error: 'Creation name is required' },
        { status: 400 }
      );
    }

    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      await new Promise((r) => setTimeout(r, 1500));
      const story = DEMO_STORIES[Math.floor(Math.random() * DEMO_STORIES.length)];
      return NextResponse.json({ story });
    }

    const { generateCreationStory } = await import('@/lib/ai/claude');
    const story = await generateCreationStory(
      creationName,
      creationDescription || '',
      bricksUsed || 0,
      colors || []
    );

    return NextResponse.json({ story });
  } catch (error) {
    console.error('Story generation error:', error);
    const fallbackStory = `In the magical world of BrickVerse, ${request.headers.get('x-creation-name') || 'this creation'} became legendary! Built with incredible skill and creativity, it inspired builders everywhere. The Great Brick Academy awarded it the highest honor — the Golden Stud Award!`;
    return NextResponse.json({ story: fallbackStory }, { status: 500 });
  }
}
