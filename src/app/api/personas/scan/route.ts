import { NextResponse, NextRequest } from "next/server";
import { scanAllAccountsForPersonas, getAllPersonaMappings } from "@/lib/SunoApi";
import { corsHeaders } from "@/lib/utils";
import { isAuthorized, unauthorizedResponse } from "@/lib/auth";

export const maxDuration = 120; // Allow more time for scanning multiple accounts
export const dynamic = "force-dynamic";

/**
 * GET /api/personas/scan
 * Scan all configured accounts for personas and register them for automatic routing.
 * This populates the persona -> account mapping cache.
 */
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new NextResponse(unauthorizedResponse.body, {
      status: unauthorizedResponse.status,
      headers: unauthorizedResponse.headers
    });
  }

  try {
    const result = await scanAllAccountsForPersonas();
    const mappings = getAllPersonaMappings();

    return new NextResponse(JSON.stringify({
      ...result,
      mappings
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error: any) {
    console.error('Error scanning personas:', error);
    return new NextResponse(JSON.stringify({ error: error.toString() }), {
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
