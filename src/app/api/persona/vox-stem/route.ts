import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers'
import { sunoApi } from "@/lib/SunoApi";
import { corsHeaders } from "@/lib/utils";
import { isAuthorized, unauthorizedResponse } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/persona/vox-stem
 *
 * Extract vox (vocal) stem from a song for persona creation.
 * This must be called before creating a persona to get the vox_audio_id.
 *
 * Request body:
 * - clip_id: string (required) - ID of the song to extract vocals from
 * - vocal_start_s: number (optional, default: 0) - Start time in seconds
 * - vocal_end_s: number (optional, default: 30) - End time in seconds
 *
 * Response:
 * { vox_audio_id: string, clip_id: string }
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
    const { clip_id, vocal_start_s = 0, vocal_end_s = 30 } = body;

    if (!clip_id) {
      return new NextResponse(JSON.stringify({ error: 'clip_id is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const result = await (await sunoApi((await cookies()).toString()))
      .extractVoxStem(clip_id, vocal_start_s, vocal_end_s);

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
    const errorStatus = error.response?.status || 500;

    console.error('Error extracting vox stem:', errorMessage);

    return new NextResponse(JSON.stringify({ error: 'Internal server error: ' + errorMessage }), {
      status: errorStatus,
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
