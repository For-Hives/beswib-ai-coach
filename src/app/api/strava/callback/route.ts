import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import axios from "axios";

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token = searchParams.get("state");
  if (!code) return NextResponse.json({ error: "Code manquant" }, { status: 400 });
  if (!token) return NextResponse.json({ error: "Non autorisé (pas de token)" }, { status: 401 });

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "vraiment_pas_secure");
    if (typeof decoded === "object" && decoded !== null) {
      userId = (decoded as JwtPayload).id || (decoded as JwtPayload)._id;
    } else {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Token invalide" }, { status: 401 });
  }

  try {
    // Échange le code contre un token Strava
    const tokenRes = await axios.post('https://www.strava.com/oauth/token', {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.STRAVA_REDIRECT_URI,
    });
    const { access_token, refresh_token, expires_at, athlete } = tokenRes.data;
    await User.findByIdAndUpdate(userId, {
      'strava.token': access_token,
      'strava.refresh_token': refresh_token,
      'strava.expires_at': expires_at,
      'strava.athlete_id': athlete.id,
    });
    // Redirige vers le front (modifie si besoin)
    return NextResponse.redirect('http://localhost:3000/profile');
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors du callback Strava" }, { status: 500 });
  }
} 