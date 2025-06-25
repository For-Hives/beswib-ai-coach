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

  // Log profil utilisateur
  console.log('Profil utilisateur utilisé pour le prompt :', userProfile);

  // Si le plan existe déjà, le retourner directement
  if (user.trainingPlan && user.trainingPlan.length > 0) {
    return NextResponse.json({ text: JSON.stringify({ summary: "", plan: user.trainingPlan }) });
  }

  // Compose le prompt pour l'IA (version enrichie et multi-discipline)
  const prompt = `
Tu es un coach sportif expert en ${userProfile.discipline || "running"} (choix possible : running, trail, cyclisme, triathlon). Ton rôle est de générer un plan d'entraînement personnalisé, structuré semaine par semaine, à partir des informations suivantes que je vais te fournir.

## Données utilisateur :
- Âge : ${userProfile.age || ""}
- Sexe : ${userProfile.gender || ""}
- Fréquence cardiaque max : ${userProfile.maxHeartRate || ""}
- Fréquence cardiaque de repos : ${userProfile.restingHeartRate || ""}
- Niveau sportif : ${userProfile.level || userProfile.experience || ""}
- Expérience dans la discipline : ${userProfile.experience || ""}
- Sports pratiqués actuellement : ${userProfile.sportsBackground || ""}
- Fréquence d'entraînement possible (nombre de séances par semaine) : ${userProfile.trainingFrequency || userProfile.weeklyVolume || userProfile.runningFrequency || userProfile.trailFrequency || userProfile.cyclingFrequency || userProfile.triathlonFrequency || ""}
- Contraintes personnelles (jours disponibles, blessures, autres) : ${userProfile.injuries || userProfile.trailJointIssues || userProfile.triathlonConstraints || ""}
- Matériel disponible : ${userProfile.material || userProfile.runningTrackAccess || userProfile.cyclingHomeTrainer || userProfile.trailGpsWatch || userProfile.triathlonPoolAccess || userProfile.triathlonBikeAccess || ""}
- Type de terrain local : ${userProfile.terrain || userProfile.trailMountainTraining || userProfile.trailUphillAccess || ""}
- Objectif principal : ${userProfile.runningGoal || userProfile.trailRaceGoal || userProfile.cyclingGoal || userProfile.triathlonFormat || ""}
- Type d'objectif : ${userProfile.type_objectif || userProfile.trailRaceGoal || userProfile.cyclingGoal || userProfile.triathlonFormat || ""}
- Distance : ${userProfile.distance_km || userProfile.trailRaceGoal || userProfile.cyclingGoal || ""}
- Dénivelé (si applicable) : ${userProfile.denivele_m || userProfile.trailRaceGoal || ""}
- Date de l'objectif : ${userProfile.runningGoalDate || userProfile.trailRaceDate || userProfile.cyclingGoalDate || userProfile.triathlonDate || ""}
- Est-ce un premier objectif ou une nouvelle tentative ? : ${userProfile.objectif_premier || ""}
- Préparation spécifique déjà commencée ? ${userProfile.prepa_en_cours || ""}
- Objectif de temps ou de classement (si fourni) : ${userProfile.runningGoalTime || userProfile.objectif_performance || ""}
- Consentement données : ${userProfile.dataUsageConsent || ""}
- Consentement notifications : ${userProfile.notificationConsent || ""}

## Consignes :

1. Calcule le nombre de semaines restantes avant l'objectif à partir de la date actuelle (${todayStr}).
2. Si l'objectif est dans plus de 8 semaines, structure le plan en deux phases :
   - Phase générale (renforcement, endurance, travail technique, foncier)
   - Phase spécifique (adaptée à la course cible)
3. Si l'objectif est dans 8 semaines ou moins, concentre-toi sur la phase spécifique.
4. Prévoyez une semaine d'affûtage (tapering) avant l'objectif principal, surtout pour les distances longues.
5. Adapte le contenu du plan à la discipline choisie :
   - **Running** : travail VMA, allure spécifique, endurance fondamentale, seuil
   - **Trail** : sorties longues avec D+, côtes, descentes techniques, rando-course, travail bâtons
   - **Cyclisme** : endurance, vélocité, PMA, travail au seuil, FTP, home trainer
   - **Triathlon** : combinaisons natation/vélo/course à pied, transitions, charges réparties intelligemment
6. Si la saison ou la météo l'impose (ex : hiver), propose des alternatives indoor (home trainer, tapis).
7. Si des blessures ou limitations sont signalées, adapte les séances pour limiter les risques (ex : éviter les descentes longues si fragilité genoux).
8. Génère un plan hebdomadaire avec 1 ligne par jour, format :
   - Jour
   - Type de séance
   - Détail de la séance (durée, intensité, zones si connues, terrain, conseils)
9. Précise si la semaine est allégée (ex. semaine 4, 8, ou semaine d'affûtage) ou de charge.
10. Termine par un rappel des conseils personnalisés : nutrition, récupération, sommeil, etc.
11. Si le niveau est débutant, ne surcharge pas la progression.
12. Si un objectif secondaire est indiqué (ex : course test ou cyclosportive intermédiaire), intègre-le intelligemment.
13. (Optionnel) Fournis le plan également au format JSON structuré pour intégration dans une application.
14. Si l'utilisateur n'a pas donné son consentement à l'utilisation des données, indique-le explicitement dans le plan et limite la personnalisation.

## Format de sortie :
- Titre avec objectif
- Phase 1 (si applicable) – Semaine X à Y : Nom + résumé
- Phase 2 – Semaine Y+1 à Z : Nom + résumé
- Pour chaque semaine : tableau ou bullet jour par jour (jour, séance, détails)
- Semaine d'affûtage avant l'objectif (si pertinent)
- Fin : conseils et rappels adaptés au profil
- (Optionnel) Plan complet au format JSON structuré (tableau des semaines, jours, séances, détails)

IMPORTANT : Réponds STRICTEMENT au format JSON structuré, sans aucun texte, commentaire, balise ou explication autour. Si tu ne respectes pas ce format, la réponse sera ignorée.
`;

  // Log du prompt envoyé à Gemini
  console.log('Prompt envoyé à Gemini :', prompt);

  // Appel à Gemini
  const { text } = await generateText({
    model: google("gemini-1.5-flash"),
    system: 'You are a helpful assistant.',
    prompt,
  });

  // Log de la réponse brute Gemini
  console.log('Réponse brute Gemini :', text);

  // Parse le résultat pour stocker le plan
  let aiResult;
  try {
    let raw = text.trim();
    if (raw.startsWith("```json")) {
      raw = raw.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (raw.startsWith("```")) {
      raw = raw.replace(/^```/, "").replace(/```$/, "").trim();
    }
    raw = raw.split('\n').filter((line: string) => !line.trim().startsWith('//')).join('\n');
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      raw = raw.substring(firstBrace, lastBrace + 1);
    }
    raw = raw.replace(/,(\s*[}\]])/g, '$1');
    aiResult = JSON.parse(raw);
  } catch (e) {
    return NextResponse.json({ error: "Invalid AI response" }, { status: 500 });
  }

  // Stocke le plan dans le profil utilisateur
  await User.findOneAndUpdate(
    { email },
    { $set: { trainingPlan: aiResult.plan } }
  );

  return NextResponse.json({ text });
} 