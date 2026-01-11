import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers'
import { sunoApi } from "@/lib/SunoApi";
import { corsHeaders } from "@/lib/utils";
import { isAuthorized, unauthorizedResponse } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/persona/delete
 *
 * Delete (trash) a persona. Can also restore a previously deleted persona.
 *
 * Query parameters:
 * - id: string (required) - ID of the persona to delete
 * - undo: boolean (optional, default: false) - Set to true to restore a deleted persona
 *
 * Response:
 * { success: boolean }
 */
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new NextResponse(unauthorizedResponse.body, {
      status: unauthorizedResponse.status,
      headers: unauthorizedResponse.headers
    });
  }

  try {
    const url = new URL(req.url);
    const personaId = url.searchParams.get('id');
    const undo = url.searchParams.get('undo') === 'true';

    if (!personaId) {
      return new NextResponse(JSON.stringify({ error: 'Missing required parameter: id' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const result = await (await sunoApi((await cookies()).toString()))
      .deletePersona(personaId, undo);

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

    console.error('Error deleting persona:', errorMessage);

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
