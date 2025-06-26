import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Activity from "@/models/Activity";
import { startOfWeek, startOfMonth } from "date-fns";

export async function GET(request: Request) {
  await dbConnect();
  const user = await requireAuth(request);
  const userId = user._id;
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);

  const week = await Activity.aggregate([
    { $match: { user: userId, start_date: { $gte: weekStart.toISOString() } } },
    { $group: { _id: null, distance: { $sum: '$distance' }, duration: { $sum: '$moving_time' } } }
  ]);
  const month = await Activity.aggregate([
    { $match: { user: userId, start_date: { $gte: monthStart.toISOString() } } },
    { $group: { _id: null, distance: { $sum: '$distance' }, duration: { $sum: '$moving_time' } } }
  ]);
  return NextResponse.json({
    week: week[0] || { distance: 0, duration: 0 },
    month: month[0] || { distance: 0, duration: 0 }
  });
} 