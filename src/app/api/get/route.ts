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
    const ids = url.searchParams.get('ids');
    const page = url.searchParams.get('page');

    const songIds = ids ? ids.split(',') : undefined;
    const audioInfo = await (await sunoApi((await cookies()).toString())).get(songIds, page);

    return new NextResponse(JSON.stringify(audioInfo), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error fetching audio info:', error);

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