import { NextRequest } from "next/server";

/**
 * Validates the API request based on the environment and API key.
 * @param req The incoming request
 * @returns true if authorized, false otherwise
 */
export function isAuthorized(req: NextRequest): boolean {
  const env = process.env.APP_ENV || 'testing';
  const apiKey = process.env.API_KEY;

  // If in testing mode, everything is allowed
  if (env === 'testing') {
    return true;
  }

  // In production, require an API key
  if (env === 'production') {
    if (!apiKey) {
      console.warn('APP_ENV is production but API_KEY is not set. All requests will be blocked.');
      return false;
    }

    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    return token === apiKey;
  }

  return true;
}

/**
 * Standard response for unauthorized requests
 */
export const unauthorizedResponse = {
  status: 401,
  body: JSON.stringify({ error: 'Unauthorized: Invalid or missing API Key' }),
  headers: { 'Content-Type': 'application/json' }
};
