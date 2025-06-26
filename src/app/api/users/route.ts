import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  await dbConnect();
  await requireAuth(request); // Optionnel: à restreindre à l'admin
  const users = await User.find({}, "email profile");
  return NextResponse.json(users);
} 