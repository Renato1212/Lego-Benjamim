import { NextRequest, NextResponse } from 'next/server';

const DEMO_RESPONSES = [
  "Wow, that's such an awesome idea! 🚀 Try using blue bricks for the base and adding some yellow pieces on top to make it really pop! You're going to create something amazing!",
  "Ooh! I love how you're thinking! 🧱 Did you know you can build a rocket with just 1x2 bricks stacked in a cone shape? Add a red top and you've got a launch-ready spacecraft!",
  "You're a natural builder! 🏆 For your dragon, try making the wings with flat plates angled outward - it'll look like it's ready to fly! Don't forget to add some orange bricks for fire-breath!",
  "Great question! 🌟 The trick to building strong towers is to offset each layer by one stud - this makes them super sturdy! Try it and see how tall you can go!",
  "That creation sounds EPIC! 🎉 I bet it'll get lots of likes in the gallery! Your building skills are truly amazing - keep it up!",
  "Brilliant thinking! 💡 For more colors, try using transparent bricks for windows and doors - they make everything look magical! You're going to create something incredible!",
  "Amazing! 🌈 You know what would make that even cooler? Add some plate pieces on the sides to create texture! It'll look like real architecture. You're such a talented builder!",
  "Oh that's so creative! 🎨 Mixing different brick heights creates really interesting patterns. Try alternating tall bricks with flat plates - it's a pro builder technique!",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      // Return a demo response
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 800));
      const response = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
      return NextResponse.json({ message: response });
    }

    // Real Claude API call
    const { chatWithBuddy } = await import('@/lib/ai/claude');
    const message = await chatWithBuddy(messages);
    return NextResponse.json({ message });
  } catch (error) {
    console.error('Buddy chat error:', error);
    return NextResponse.json(
      { message: "Oops! My bricks got mixed up! 🧱 Try again in a moment!" },
      { status: 500 }
    );
  }
}
