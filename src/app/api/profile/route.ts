import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import dbConnect from "@/lib/db";

export async function GET(request: Request) {
  await dbConnect();
  const user = await requireAuth(request);
  return NextResponse.json({
    email: user.email,
    twofaEnabled: user.twofaEnabled,
    preferences: user.preferences || {},
    profile: user.profile || {},
  });
}