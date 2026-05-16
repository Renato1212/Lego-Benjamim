import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const KID_SAFE_SYSTEM_PROMPT = `You are Brix, the friendly LEGO Brick Buddy! You help kids aged 6-12 with their LEGO adventures.

Your personality:
- Super enthusiastic and encouraging 🧱
- Use simple, fun language kids can understand
- ALWAYS be positive and supportive
- Use emojis to make things fun
- Keep responses short and punchy (2-4 sentences max for chat)
- Reference LEGO themes kids love: City, Space, Fantasy, Technic, Friends

Safety rules (NEVER break these):
- Only talk about LEGO, building, creativity, and learning
- Never discuss violence, adult topics, or scary content
- If asked something off-topic, redirect to LEGO fun
- Be kind, inclusive, and encouraging to ALL kids
- Celebrate creativity and imagination

When giving build suggestions:
- Make them exciting with a story angle
- Give specific brick type suggestions
- Encourage kids to add their own ideas`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function chatWithBuddy(
  messages: ChatMessage[],
  userInventory?: string
): Promise<string> {
  const systemPrompt = userInventory
    ? `${KID_SAFE_SYSTEM_PROMPT}\n\nThe kid's current brick inventory: ${userInventory}`
    : KID_SAFE_SYSTEM_PROMPT;

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 300,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  return content.text;
}

export async function generateBuildIdeas(
  inventory: string,
  theme?: string,
  difficulty?: string
): Promise<string> {
  const prompt = `Based on this LEGO brick inventory: ${inventory}

Generate 5 exciting build ideas for a kid aged 6-12.
${theme ? `Focus on ${theme} theme.` : ''}
${difficulty ? `Difficulty level: ${difficulty}.` : ''}

For each idea provide:
- A super exciting name
- A 1-2 sentence description with a story hook
- Estimated number of pieces
- Difficulty (easy/medium/hard)
- Main theme/category
- Fun tags (3-4)

Return as a JSON array with fields: title, description, difficulty, theme, estimatedParts, tags, timeEstimate`;

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1000,
    system: KID_SAFE_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  return content.text;
}

export async function generateCreationStory(
  creationName: string,
  creationDescription: string,
  bricksUsed: number,
  colors: string[]
): Promise<string> {
  const prompt = `Write an exciting, imaginative story for a child's LEGO creation!

Creation name: "${creationName}"
Description: "${creationDescription}"
Bricks used: ${bricksUsed}
Colors: ${colors.join(', ')}

Write a 3-4 sentence story that:
- Makes the creation feel magical and alive
- Mentions specific colors and features
- Has a young hero or adventurer
- Ends with an exciting moment or cliffhanger
- Uses simple, fun language for kids aged 6-12
- Includes the brick count in a creative way

Do NOT include quotation marks around the story. Just write it naturally.`;

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 300,
    system: KID_SAFE_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  return content.text;
}

export const DEMO_BUDDY_RESPONSES = [
  "Wow, that's such an awesome idea! 🚀 Try using blue bricks for the base and adding some yellow pieces on top to make it really pop! You're going to create something amazing!",
  "Ooh! I love how you're thinking! 🧱 Did you know you can build a rocket with just 1x2 bricks stacked in a cone shape? Add a red top and you've got a launch-ready spacecraft!",
  "You're a natural builder! 🏆 For your dragon, try making the wings with flat plates angled outward - it'll look like it's ready to fly! Don't forget to add some orange bricks for fire-breath effect!",
  "Great question! 🌟 The trick to building strong towers is to offset each layer by one stud - this makes them super sturdy! Try it and see how tall you can go!",
  "That creation sounds EPIC! 🎉 Share it in the gallery so everyone can see! I bet you'll get lots of likes - you clearly have amazing building skills!",
  "Brilliant thinking! 💡 For more colors, try using transparent bricks for windows and doors - they make everything look magical! Your creation is going to be incredible!",
];
