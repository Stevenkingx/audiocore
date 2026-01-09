import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const LyricsSchema = z.object({
  title: z.string(),
  lyrics: z.string(),
  style: z.string(),
});

export async function generateLyricsWithAI(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured in .env');
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a professional songwriter. Generate high-quality lyrics, a title, and musical style tags based on the user prompt. Use [Verse], [Chorus], [Bridge] structure for lyrics. Return a JSON object with keys: title, lyrics, style." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error('Failed to generate lyrics');
  
  const parsed = JSON.parse(content);
  
  // Handle case where lyrics might be an object or array
  let processedLyrics = parsed.lyrics;
  if (typeof processedLyrics === 'object' && processedLyrics !== null) {
    // If it's an object (e.g., { verse1: "...", chorus: "..." }), flatten it
    processedLyrics = Object.values(processedLyrics).join('\n\n');
  } else if (Array.isArray(processedLyrics)) {
    processedLyrics = processedLyrics.join('\n\n');
  }

  // Ensure everything is a string
  return {
    title: String(parsed.title || 'Untitled'),
    lyrics: String(processedLyrics || ''),
    style: Array.isArray(parsed.style) ? parsed.style.join(' ') : String(parsed.style || ''),
  };
}
