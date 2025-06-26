import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/db";

export async function requireAuth(request: Request) {
  await dbConnect();
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Response("Unauthorized", { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    throw new Response("Invalid token", { status: 401 });
  }
  const user = await User.findOne({ email: decoded.email });
  if (!user) throw new Response("User not found", { status: 401 });
  return user;
} 