import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = process.env.STRAVA_REDIRECT_URI;
  const scope = 'activity:read_all,profile:read_all';

  // Récupère le JWT du header Authorization
  const authHeader = request.headers.get("authorization");
  let state = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    state = authHeader.split(' ')[1];
  }

  const url = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=auto&scope=${scope}&state=${state}`;
  return NextResponse.redirect(url);
} 