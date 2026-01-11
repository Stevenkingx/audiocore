import { NextResponse, NextRequest } from "next/server";
import { generateLyricsWithAI, LyricsRequest } from "@/lib/ai";
import { corsHeaders } from "@/lib/utils";
import { isAuthorized, unauthorizedResponse } from "@/lib/auth";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

/**
 * POST /api/ai_lyrics
 *
 * Generate song lyrics, title, and music style using AI (ChatGPT).
 * Optimized for Suno AI with proper section tags and music prompts.
 *
 * Request body:
 * - prompt: string (required) - Theme or concept for the song
 * - genre: string (optional) - Musical genre (e.g., "acoustic pop", "indie rock")
 * - mood: string (optional) - Mood/vibe (e.g., "warm, hopeful", "dark, intense")
 * - type: "solo" | "duet" (optional, default: "solo") - Solo or duet song
 * - avoid: string[] (optional) - Words to avoid in lyrics
 *
 * Response:
 * {
 *   title: string,
 *   song_type: "Solo" | "Duet",
 *   music_prompt: string (600-800 chars, detailed style for Suno),
 *   lyrics: string (with section tags),
 *   style: string (extracted keywords for backwards compatibility)
 * }
 */
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new NextResponse(unauthorizedResponse.body, {
      status: unauthorizedResponse.status,
      headers: unauthorizedResponse.headers
    });
  }

  try {
    const body = await req.json();
    const { prompt, genre, mood, type, avoid } = body;

    if (!prompt) {
      return new NextResponse(JSON.stringify({ error: 'prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Build request object
    const request: LyricsRequest = {
      prompt: String(prompt),
    };

    if (genre) request.genre = String(genre);
    if (mood) request.mood = String(mood);
    if (type && (type === 'solo' || type === 'duet')) {
      request.type = type;
    }
    if (Array.isArray(avoid)) {
      request.avoid = avoid.map(String);
    }

    const result = await generateLyricsWithAI(request);

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error: any) {
    console.error('Error generating AI lyrics:', error);
    return new NextResponse(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}
