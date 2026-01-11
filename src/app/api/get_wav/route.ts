import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers'
import { sunoApi } from "@/lib/SunoApi";
import { corsHeaders } from "@/lib/utils";
import { isAuthorized, unauthorizedResponse } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/get_wav?id={song_id}
 *
 * Get the WAV file URL for a song (Pro feature).
 * This endpoint initiates the WAV conversion and returns the download URL.
 *
 * Query Parameters:
 * - id: The song ID to get WAV for (required)
 * - wait: If "false", returns immediately without waiting for conversion (optional, default: true)
 *
 * Response:
 * - wav_url: The URL to download the WAV file (e.g., https://cdn1.suno.ai/{id}.wav)
 * - status: "complete" when WAV is ready
 */
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new NextResponse(unauthorizedResponse.body, {
      status: unauthorizedResponse.status,
      headers: unauthorizedResponse.headers
    });
  }

  try {
    const url = new URL(req.url);
    const songId = url.searchParams.get('id');
    const waitParam = url.searchParams.get('wait');
    const waitForWav = waitParam !== 'false';

    if (!songId) {
      return new NextResponse(JSON.stringify({ error: 'Missing required parameter: id' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const api = await sunoApi((await cookies()).toString());

    // Initiate conversion and get WAV URL
    const result = await api.downloadWav(songId);

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error getting WAV file:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = errorMessage.includes('Pro') ? 403 : 500;

    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}
