import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers'
import { sunoApi } from "@/lib/SunoApi";
import { corsHeaders } from "@/lib/utils";
import { isAuthorized, unauthorizedResponse } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/persona/create
 *
 * Create a persona (voice profile) from a song clip.
 * First call /api/persona/vox-stem to get the vox_audio_id, then use it here.
 * Personas are NOT public by default.
 *
 * Request body:
 * - clip_id: string (required) - ID of the original song clip
 * - name: string (required) - Name for the persona
 * - description: string (optional) - Description for the persona
 * - is_public: boolean (optional, default: false) - Whether persona should be public
 * - vox_audio_id: string (optional) - ID from /api/persona/vox-stem response
 * - vocal_start_s: number (optional, default: 0) - Start time in seconds for the vocal sample
 * - vocal_end_s: number (optional, default: 30) - End time in seconds for the vocal sample
 * - user_input_styles: string (optional) - Style tags for the persona (e.g., "rock, alternative")
 *
 * Response:
 * PersonaInfo object with the created persona details
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
    const {
      clip_id,
      name,
      description = '',
      is_public = false,
      vox_audio_id,
      vocal_start_s = 0,
      vocal_end_s = 30,
      user_input_styles = ''
    } = body;

    if (!clip_id) {
      return new NextResponse(JSON.stringify({ error: 'clip_id is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    if (!name) {
      return new NextResponse(JSON.stringify({ error: 'name is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const persona = await (await sunoApi((await cookies()).toString()))
      .createPersona(clip_id, name, description, is_public, vox_audio_id, vocal_start_s, vocal_end_s, user_input_styles);

    return new NextResponse(JSON.stringify(persona), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
    const errorStatus = error.response?.status || 500;

    console.error('Error creating persona:', errorMessage);

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
