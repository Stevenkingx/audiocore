import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers'
import { sunoApi } from "@/lib/SunoApi";
import { corsHeaders } from "@/lib/utils";
import { isAuthorized, unauthorizedResponse } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new NextResponse(unauthorizedResponse.body, { 
      status: unauthorizedResponse.status, 
      headers: unauthorizedResponse.headers 
    });
  }

  try {
    const url = new URL(req.url);
    const songId = url.searchParams.get('song_id');

    if (songId == null) {
      return new NextResponse(JSON.stringify({ error: 'Missing parameter song_id' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const alignment = await (await sunoApi((await cookies()).toString())).getLyricAlignment(songId);

    return new NextResponse(JSON.stringify(alignment), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error fetching lyric alignment:', error);

    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
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
