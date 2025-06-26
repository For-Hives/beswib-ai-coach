import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import axios from "axios";

export async function GET(request: Request) {
  await dbConnect();
  const user = await requireAuth(request);
  const freshUser = await User.findById(user._id);
  if (!freshUser) {
    return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 401 });
  }
  const accessToken = freshUser.strava?.token;
  const athleteId = freshUser.strava?.athlete_id;
  if (!accessToken || !athleteId) {
    return NextResponse.json({ message: "Token ou ID manquant" }, { status: 400 });
  }
  const response = await axios.get(`https://www.strava.com/api/v3/athletes/${athleteId}/stats`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return NextResponse.json(response.data);
} 