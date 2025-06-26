import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  const { email, password } = await request.json();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 401 });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }
  const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  return NextResponse.json({ token });
} 