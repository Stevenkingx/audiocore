import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers';
import { DEFAULT_MODEL, sunoApi, getPersonaAccountAsync } from "@/lib/SunoApi";
import { corsHeaders } from "@/lib/utils";
import { isAuthorized, unauthorizedResponse } from "@/lib/auth";

export const maxDuration = 60; // allow longer timeout for wait_audio == true
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new NextResponse(unauthorizedResponse.body, {
      status: unauthorizedResponse.status,
      headers: unauthorizedResponse.headers
    });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { prompt, tags, title, make_instrumental, model, wait_audio, negative_tags, persona_id, artist_clip_id, root_clip_id } = body;
      // Accept either artist_clip_id or root_clip_id (root_clip_id is returned by /api/personas)
      const clipId = artist_clip_id || root_clip_id;

      // If persona_id is provided, route to the correct account automatically
      let accountIndex: number | undefined;
      if (persona_id) {
        accountIndex = await getPersonaAccountAsync(persona_id);
        if (accountIndex !== undefined) {
          console.log(`Routing to account #${accountIndex + 1} for persona ${persona_id}`);
        }
      }

      const audioInfo = await (await sunoApi((await cookies()).toString(), accountIndex)).custom_generate(
        prompt, tags, title,
        Boolean(make_instrumental),
        model || DEFAULT_MODEL,
        Boolean(wait_audio),
        negative_tags,
        persona_id,
        clipId
      );
      return new NextResponse(JSON.stringify(audioInfo), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error: any) {
      console.error('Error generating custom audio:', error);
      return new NextResponse(JSON.stringify({ error: error.response?.data?.detail || error.toString() }), {
        status: error.response?.status || 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  } else {
    return new NextResponse('Method Not Allowed', {
      headers: {
        Allow: 'POST',
        ...corsHeaders
      },
      status: 405
    });
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}
