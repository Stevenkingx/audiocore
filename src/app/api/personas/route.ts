import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers'
import { sunoApi } from "@/lib/SunoApi";
import { corsHeaders } from "@/lib/utils";
import { isAuthorized, unauthorizedResponse } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/personas
 *
 * Get list of user's personas (voice profiles).
 *
 * Query parameters:
 * - page: number (optional, default: 1) - Page number for pagination
 *
 * Response:
 * Object with:
 * - personas: Array of persona objects
 * - total_results: number - Total number of personas
 * - current_page: number - Current page number
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
    const page = url.searchParams.get('page');
    const pageNumber = page ? parseInt(page) : 1;

    const result = await (await sunoApi((await cookies()).toString()))
      .getPersonas(pageNumber);

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

    console.error('Error fetching personas:', errorMessage);

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
