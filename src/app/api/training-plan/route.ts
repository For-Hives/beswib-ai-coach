import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "../../../models/User";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
// @ts-ignore
import jwt from "jsonwebtoken";
import { z } from "zod";

if (!mongoose.connection.readyState) {
  await mongoose.connect(process.env.MONGODB_URI!);
}

// Fonction pour calculer le nombre de semaines jusqu'à une date
const weeksUntil = (dateStr: string) => {
  const goalDate = new Date(dateStr);
  const today = new Date();
  const diffTime = Math.abs(goalDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.ceil(diffDays / 7);
};

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.replace("Bearer ", "");
  let email;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === "string" || !("email" in decoded)) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }
    email = decoded.email;
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const user = await User.findOne({ email });
  if (!user || !user.profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  
  // Si un plan existe déjà et a été généré récemment, le retourner.
  if (user.planData && Object.keys(user.planData).length > 0) {
     console.log("Plan existant trouvé, renvoi du plan en cache.");
     return NextResponse.json(user.planData);
  }

  const userProfile = user.profile;
  const todayStr = userProfile.today || new Date().toISOString().split("T")[0];

  // Construction du prompt structuré
  const promptData = {
    context: {
      discipline: userProfile.discipline || "Non spécifié",
      generationDate: todayStr,
      stravaDataConnected: !!user.strava,
      weeksToGoal: userProfile.goalDate ? weeksUntil(userProfile.goalDate) : 0,
    },
    athleteProfile: {
      personal: {
        age: userProfile.age || "",
        gender: userProfile.gender || "",
        height_cm: userProfile.height || "",
        weight_kg: userProfile.weight || "",
      },
      physiological: {
        maxHeartRate: userProfile.maxHeartRate || "",
        restingHeartRate: userProfile.restingHeartRate || "",
        vma_kmh_or_ftp_w: userProfile.vmaOrFtp || "",
        lastTestDate: userProfile.lastTestDate || "",
      },
      performanceHistory: {
        experienceLevel: userProfile.runningExperience || userProfile.trailExperience || userProfile.cyclingExperience || "Non spécifié",
        record10k: userProfile.record10k || "",
        maxEffortDuration_min: userProfile.maxEffortDuration || "",
        recentBestPerformance: userProfile.runningRecentRace || "",
      },
    },
    mainGoal: {
      name: userProfile.goalName || "",
      type: userProfile.goalType || "",
      distance_km: userProfile.goalDistance || "",
      elevation_m: userProfile.goalElevation || "",
      date: userProfile.goalDate || "",
      performanceTarget: userProfile.goalPerformance || "",
      isFirstAttempt: userProfile.firstGoal || "",
      specificPrepStarted: userProfile.specificPrepStarted || "",
    },
    secondaryGoals: userProfile.secondaryObjectives || [],
    unavailabilities: userProfile.unavailabilities || [],
    trainingContext: {
      lifestyle: {
        availableDays: userProfile.availableDays || "",
        unpredictableDays: userProfile.unpredictableDays || "",
        commitments: userProfile.commitments || "",
        dailyStressLevel: userProfile.dailyStress || "",
        mentalLoad: userProfile.mentalLoad || "",
      },
      environment: {
        usualClimate: userProfile.usualClimate || "",
        trainingAltitude_m: userProfile.averageAltitude || "",
        mainSurface: userProfile.mainSurface || "",
        trackAccess: userProfile.runningTrackAccess || "Non",
        mountainAccess: userProfile.trailMountainAccess || "Non",
        homeTrainerAccess: userProfile.cyclingHomeTrainer || "Non",
      },
      preferences: {
        preferredSessionTypes: userProfile.sessionTypes || [],
        favoriteEnvironments: userProfile.favoriteEnvironments || [],
        trainingSoloOrGroup: userProfile.groupPreference || "",
        musicPreference: userProfile.musicPreference || "",
        crossTraining: userProfile.crossTrainingSports || [],
      },
    },
    healthAndNutrition: {
      health: {
        injuryHistory: userProfile.injuryHistory || "",
        weakZones: userProfile.weakZones || "",
        mobilityLevel: userProfile.mobility || "",
        currentInjuries: userProfile.runningInjuries || userProfile.trailInjuries || userProfile.cyclingInjuries || userProfile.triathlonInjuries || "",
      },
      recovery: {
        averageSleepHours: userProfile.sleepHours || "",
        sleepQuality: userProfile.sleepQuality || "",
        recoveryRoutines: userProfile.recoveryRoutines || [],
      },
      nutrition: {
        dietType: userProfile.dietType || "",
        hydrationHabits_L_per_day: userProfile.hydrationHabits || "",
        nutritionToleranceDuringEffort: userProfile.nutritionTolerance || "",
        nutritionBrands: userProfile.nutritionBrands || "",
        nutritionGoals: userProfile.nutritionGoals || "",
        supplements: userProfile.supplements || "",
      },
    },
    motivation: {
      mainReason: userProfile.sportReason || "",
      motivationLevel: userProfile.motivationLevel || "",
      coachExpectations: userProfile.coachExpectations || "",
    },
  };

  const systemPrompt = `
Tu es un coach sportif IA de classe mondiale, expert en physiologie du sport, en planification d'entraînement et en psychologie de la performance pour la discipline spécifiée dans le contexte.
Ta mission est de générer un bloc d'entraînement structuré de 14 jours pour l'athlète dont le profil complet est détaillé ci-dessous.
Ta réponse doit être uniquement et exclusivement un objet JSON valide, sans aucun texte, explication, ou formatage Markdown avant ou après le bloc JSON.
La structure du JSON doit suivre précisément ce modèle:
{
  "blockSummary": { "title": string, "period": string, "mainFocus": string, "intensity": string, "targetFormState": string },
  "trainingPlan": [{ "day": string, "date": "YYYY-MM-DD", "sessionType": string, "title": string, "description": string, "details": string, "duration_min": number, "distance_km": number, "intensity": number, "rpe": number }],
  "blockRecap": { "week1": { "volume_km": number, "volume_hours": number, "sessions": number }, "week2": { "volume_km": number, "volume_hours": number, "sessions": number }, "totalSessions": number, "intensityDistribution": { "zone1_2_percentage": number, "zone3_4_percentage": number, "zone5_percentage": number }, "skillsTargeted": string[] },
  "extraAdvice": { "nutrition": string, "recovery": string, "stressManagement": string, "mentalPrep": string },
  "motivationalQuote": string
}
Prends en compte le tableau 'unavailabilities' qui contient les dates où l'athlète n'est pas disponible. Ne planifie AUCUNE séance d'entraînement sur ces dates. Tu peux y mettre un repos si nécessaire.
Pour les séances de type 'Fractionné' ou 'Seuil', le champ 'details' doit être particulièrement riche. Il doit inclure la structure complète : échauffement, nombre et durée/distance des répétitions, allure ou zone FC cible, durée et nature de la récupération, et retour au calme.
Exemple pour 'details': "20min échauffement Z1-Z2; 8x400m à 100% VMA avec récupération 200m footing; 10min retour au calme Z1."
Assure-toi que la première séance du plan commence à la 'generationDate' fournie dans le contexte. Les dates doivent être séquentielles.
`;
  
  console.log('Données du prompt envoyées à Gemini :', JSON.stringify(promptData, null, 2));

  try {
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      prompt: `Génère le plan d'entraînement pour cet utilisateur : ${JSON.stringify(promptData)}`,
    });

    console.log('Réponse brute de Gemini :', text);
    
    // Nettoyage de la réponse pour extraire le JSON pur
    let cleanText = text.trim();
    const jsonMatch = cleanText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      cleanText = jsonMatch[1];
    }

    // Le modèle est instruit de renvoyer du JSON, donc on parse directement.
    const aiResult = JSON.parse(cleanText);

    // Petite validation pour s'assurer que la structure de base est là
    if (!aiResult.blockSummary || !Array.isArray(aiResult.trainingPlan)) {
      throw new Error("La réponse de l'IA n'a pas la structure attendue.");
    }

    // Sauvegarde de l'objet JSON complet du plan
    await User.findOneAndUpdate(
      { email },
      { $set: { planData: aiResult } },
      { new: true }
    );
    
    return NextResponse.json(aiResult);

  } catch (e: any) {
    console.error("Erreur lors de la génération ou du parsing du plan :", e);
    // En cas d'erreur, renvoyer un objet d'erreur clair
    return NextResponse.json(
      { error: "Erreur lors de la génération du plan d'entraînement.", details: e.message },
      { status: 500 }
    );
  }
} 