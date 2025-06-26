import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  const { email, password } = await request.json();
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Utilisateur déjà existant" }, { status: 400 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });
  const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  return NextResponse.json({ token });
} 