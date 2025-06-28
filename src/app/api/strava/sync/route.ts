import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Activity from "@/models/Activity";
import axios from "axios";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const user = await requireAuth(request);
    let freshUser = await User.findById(user._id);

    if (!freshUser || !freshUser.strava || !freshUser.strava.token) {
      return NextResponse.json({ message: "Utilisateur non trouvé ou non connecté à Strava" }, { status: 401 });
    }

    let accessToken = freshUser.strava.token;
    const refreshToken = freshUser.strava.refresh_token;
    const expiresAt = freshUser.strava.expires_at;

    // Si le token expire dans moins de 5 minutes, on le rafraîchit
    if (expiresAt * 1000 < Date.now() + 300000) {
      console.log('Strava token expired, refreshing...');
      const response = await axios.post('https://www.strava.com/oauth/token', {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token, expires_at } = response.data;

      await User.findByIdAndUpdate(freshUser._id, {
        'strava.token': access_token,
        'strava.refresh_token': refresh_token,
        'strava.expires_at': expires_at,
      });

      accessToken = access_token;
      console.log('Strava token refreshed successfully.');
    }

    const lastActivity = await Activity.findOne({ user: freshUser._id }).sort({ start_date: -1 });

    let stravaApiUrl = 'https://www.strava.com/api/v3/athlete/activities?per_page=200';
    if (lastActivity) {
      const afterTimestamp = Math.floor(new Date(lastActivity.start_date).getTime() / 1000);
      stravaApiUrl += `&after=${afterTimestamp}`;
    }

    const stravaResponse = await axios.get(stravaApiUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const activities = stravaResponse.data;

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
          raw: act,
        },
        { upsert: true }
      );
    }
    return NextResponse.json({ message: 'Activités synchronisées', count: activities.length });

  } catch (error: any) {
    const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error('Erreur détaillée lors de la synchronisation Strava:', errorMessage);
    return NextResponse.json({ message: 'Erreur lors de la synchronisation Strava', error: errorMessage }, { status: 500 });
  }
} 