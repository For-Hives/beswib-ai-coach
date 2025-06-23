import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET() {
  // TODO: Replace with real user data from session or DB
  const userProfile = {
    age: 30,
    gender: "male",
    trainingFrequency: "3",
    targetDistance: "10k",
    targetMonth: "october",
    // ...add more fields as needed
  };

  // Compose a prompt for the AI
  const prompt = `
Génère un plan d'entraînement de 2 semaines pour un coureur :
- Âge : ${userProfile.age}
- Sexe : ${userProfile.gender}
- Fréquence : ${userProfile.trainingFrequency} fois/semaine
- Objectif : ${userProfile.targetDistance}
- Mois objectif : ${userProfile.targetMonth}
Format JSON : [{"id":1,"date":"2024-07-01","type":"Endurance","distance":"8 km","duration":"45 min","description":"Séance d'endurance fondamentale"}, ...]
  `;

  // Call Gemini
  const { text } = await generateText({
    model: google("gemini-1.5-flash"),
    system: 'You are a helpful assistant.',
    prompt,
  });

  return NextResponse.json({text});
} 