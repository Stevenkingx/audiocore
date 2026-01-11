import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers'
import { sunoApi } from "@/lib/SunoApi";
import { corsHeaders } from "@/lib/utils";
import { isAuthorized, unauthorizedResponse } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/download_stems
 *
 * Generate stems from a song and download them as WAV files (Pro feature).
 *
 * Request body:
 * - audio_id: string (required) - ID of the song to extract stems from
 * - stem_type: 'two' | 'all' (optional, default: 'two')
 *   - 'two': Vocals + Instrumental (10 credits)
 *   - 'all': All detected stems (50 credits)
 *
 * Response:
 * Array of objects with:
 * - id: string - Stem clip ID
 * - title: string - Stem title
 * - wav_url: string - URL to download WAV file
 * - audio_url: string - URL to MP3 file
 * - stem_from_id: string - Original song ID
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
    const { audio_id, stem_type = 'two' } = body;

    if (!audio_id) {
      return new NextResponse(JSON.stringify({ error: 'Audio ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Validate stem_type
    if (stem_type !== 'two' && stem_type !== 'all') {
      return new NextResponse(JSON.stringify({ error: 'stem_type must be "two" or "all"' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const stemsWav = await (await sunoApi((await cookies()).toString()))
      .downloadStemsWav(audio_id, stem_type);

    return new NextResponse(JSON.stringify(stemsWav), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
    const errorStatus = error.response?.status || 500;

    console.error('Error downloading stems:', errorMessage);

    if (errorStatus === 402) {
      return new NextResponse(JSON.stringify({ error: errorMessage }), {
        status: 402,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    if (errorStatus === 403) {
      return new NextResponse(JSON.stringify({
        error: 'WAV download requires Pro subscription',
        detail: errorMessage
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

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
