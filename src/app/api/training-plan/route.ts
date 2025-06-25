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
Tu es un coach sportif expert en ${userProfile.discipline || "running"} (choix possible : running, trail, cyclisme, triathlon). Ton rôle est de générer un plan d'entraînement personnalisé, à partir des informations suivantes que je vais te fournir.

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

1. Calcule le nombre de semaines restantes avant l'objectif à partir de la date actuelle.
2. Si l'objectif est dans plus de 8 semaines, structure le plan en deux phases :
   - Phase générale (renforcement, endurance, travail technique, foncier)
   - Phase spécifique (adaptée à la course cible)
3. Si l'objectif est dans 8 semaines ou moins, concentre-toi sur la phase spécifique.
4. Adapte le contenu du plan à la discipline choisie :
   - **Running** : travail VMA, allure spécifique, endurance fondamentale, seuil
   - **Trail** : sorties longues avec D+, côtes, descentes techniques, rando-course, travail bâtons
   - **Cyclisme** : endurance, vélocité, PMA, travail au seuil, FTP, home trainer
   - **Triathlon** : combinaisons natation/vélo/course à pied, transitions, charges réparties intelligemment
5. Génère un plan hebdomadaire avec 1 ligne par jour, format :
   - Jour
   - Type de séance
   - Détail de la séance (durée, intensité, zones si connues, terrain, conseils)
6. Précise si la semaine est allégée (ex. semaine 4, 8) ou de charge.
7. Termine par un rappel des conseils personnalisés : nutrition, récupération, sommeil, etc.
8. Si le niveau est débutant, ne surcharge pas la progression.
9. Si un objectif secondaire est indiqué (ex : course test ou cyclosportive intermédiaire), intègre-le intelligemment.

## Format de sortie strictement attendu (JSON OBLIGATOIRE) :
- Un champ 'plan' qui est un tableau à plat, chaque séance étant un objet avec :
   - date (obligatoire, format YYYY-MM-DD, la première séance commence aujourd'hui ou le prochain lundi, la dernière séance - la course - doit être à la date d'objectif)
   - type (ex : Course, Repos, VTT, Fractionné, etc.)
   - distance (optionnel)
   - duration (optionnel)
   - details ou description (optionnel)
- Un champ 'conseils' qui est un tableau de strings (rappels, conseils personnalisés, nutrition, récupération, etc.) à afficher sous le calendrier.

### Exemple de format JSON attendu :
{
  "plan": [
    {
      "date": "2025-07-14",
      "type": "Course",
      "distance": "10 km",
      "duration": "50 min",
      "details": "Allure modérée, terrain vallonné"
    },
    {
      "date": "2025-07-15",
      "type": "Repos"
    },
    ...
    {
      "date": "2025-08-02",
      "type": "Course (Objectif)",
      "details": "Jour de la course ! 70km, 3400D+"
    }
  ],
  "conseils": [
    "Hydratation régulière",
    "Alimentation équilibrée riche en glucides",
    "Sommeil suffisant (7-9h par nuit)",
    "Écouter son corps et adapter les séances en fonction",
    "Bien récupérer entre les séances"
  ]
}

IMPORTANT : Réponds STRICTEMENT au format JSON structuré ci-dessus, sans aucun texte, commentaire, balise ou explication autour. Si tu ne respectes pas ce format, la réponse sera ignorée.
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
    } else if (raw.startsWith("```") ) {
      raw = raw.replace(/^```/, "").replace(/```$/, "").trim();
    }
    raw = raw.split('\n').filter((line) => !line.trim().startsWith('//')).join('\n');
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

  // Stocke directement le plan Gemini (déjà à plat avec dates)
  await User.findOneAndUpdate(
    { email },
    { $set: { trainingPlan: aiResult.plan } }
  );

  return NextResponse.json({ text });
} 