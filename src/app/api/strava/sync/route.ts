import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Activity from "@/models/Activity";
import axios from "axios";

export async function GET(request: Request) {
  await dbConnect();
  const user = await requireAuth(request);
  const freshUser = await User.findById(user._id);
  if (!freshUser) {
    return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 401 });
  }
  const accessToken = freshUser.strava?.token;
  if (!accessToken) {
    return NextResponse.json({ message: "Pas de token Strava" }, { status: 400 });
  }
  // Récupère les activités Strava
  const response = await axios.get('https://www.strava.com/api/v3/athlete/activities?per_page=100', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const activities = response.data;
  // Stocke ou met à jour chaque activité
  for (const act of activities) {
    await Activity.findOneAndUpdate(
      { strava_id: act.id.toString() },
      {
        user: freshUser._id,
        strava_id: act.id.toString(),
        name: act.name,
        type: act.type,
        distance: act.distance,
        moving_time: act.moving_time,
        elapsed_time: act.elapsed_time,
        start_date: act.start_date,
        average_speed: act.average_speed,
        max_speed: act.max_speed,
        total_elevation_gain: act.total_elevation_gain,
        raw: act
      },
      { upsert: true }
    );
  }
  return NextResponse.json({ message: 'Activités synchronisées', count: activities.length });
} 