import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI n'est pas défini dans les variables d'environnement");
}

let cached = (global as any).mongoose || { conn: null };

export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  cached.conn = await mongoose.connect(MONGODB_URI);
  (global as any).mongoose = cached;
  return cached.conn;
} 