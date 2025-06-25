import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${file.name}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, fileName);

  // Crée le dossier uploads s'il n'existe pas
  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, buffer);

  return NextResponse.json({ url: `/uploads/${fileName}` });
} 