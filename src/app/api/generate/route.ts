import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const { text } = await generateText({
    model: google("gemini-1.5-flash"),
    system: 'You are a helpful assistant.',
    prompt,
  });

  return Response.json({ text });
}