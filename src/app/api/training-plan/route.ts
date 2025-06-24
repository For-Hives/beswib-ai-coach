import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
// @ts-ignore
import jwt from "jsonwebtoken";

if (!mongoose.connection.readyState) {
  await mongoose.connect(process.env.MONGODB_URI!);
}

export async function GET(req: Request) {
  // Récupère le JWT du header Authorization
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");
  let email;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === 'string' || !('email' in decoded)) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }
    email = decoded.email;
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Récupère le profil utilisateur
  const user = await User.findOne({ email });
  if (!user || !user.profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  const userProfile = user.profile;

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Compose le prompt pour l'IA
  const prompt = `
Pour un coureur avec ce profil :
- Âge : ${userProfile.age}
- Sexe : ${userProfile.gender}
- Fréquence d'entraînement : ${userProfile.trainingFrequency} fois/semaine
- Objectif : ${userProfile.targetDistance}
- Mois objectif : ${userProfile.targetMonth}

La première séance doit être à partir de la date d'aujourd'hui : ${todayStr}
Génère les séances à partir de cette date, sur 2 à 3 semaines.

1. Résume l'objectif de l'utilisateur, réfléchis pour voir si c'est réalisable et donne des conseils personnalisés pour atteindre cet objectif.
2. Génère OBLIGATOIREMENT un plan d'entraînement running basé sur les capacités du user, au format tableau JSON STRICTEMENT VALIDE, pour insertion dans un calendrier.
   - Le champ "plan" doit être un tableau de 10 à 14 séances, chaque séance au format :
     {
       "id": 1,
       "date": "YYYY-MM-DD",
       "type": "Endurance",
       "distance": "8 km",
       "duration": "45 min",
       "description": "Séance d'endurance fondamentale"
     }
   - Les dates doivent être réalistes et réparties sur 2 à 3 semaines à partir de ${todayStr}.
   - N'ajoute aucun commentaire, texte ou explication en dehors du JSON.
   - Ne mets pas de virgule en trop à la fin des tableaux ou objets.
   - Si tu ne respectes pas ce format, la réponse sera ignorée.

Réponds au format suivant (et rien d'autre) :
{
  "summary": "...",
  "plan": [
    { "id": 1, "date": "${todayStr}", "type": "Endurance", "distance": "8 km", "duration": "45 min", "description": "Séance d'endurance fondamentale" }
    // ... autres séances ...
  ]
}
`;

  // Appel à Gemini
  const { text } = await generateText({
    model: google("gemini-1.5-flash"),
    system: 'You are a helpful assistant.',
    prompt,
  });

  return NextResponse.json({ text });
} 