"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainingCalendar, TrainingSession } from "@/components/calendar/training-calendar";
import { useRouter } from "next/navigation";
import { BarChart, Heart, Target, Wind } from "lucide-react";
import apiClient, { ApiError } from "@/lib/api";

interface BlockSummary {
  title: string;
  period: string;
  mainFocus: string;
  intensity: string;
  targetFormState: string;
}

interface BlockRecap {
  week1: { volume_km: number; volume_hours: number; sessions: number };
  week2: { volume_km: number; volume_hours: number; sessions: number };
  totalSessions: number;
  intensityDistribution: {
    zone1_2_percentage: number;
    zone3_4_percentage: number;
    zone5_percentage: number;
  };
  skillsTargeted: string[];
}

interface ExtraAdvice {
  nutrition: string;
  recovery: string;
  stressManagement: string;
  mentalPrep: string;
}

export default function TrainingPlanPage() {
  const [plan, setPlan] = useState<TrainingSession[]>([]);
  const [blockSummary, setBlockSummary] = useState<BlockSummary | null>(null);
  const [blockRecap, setBlockRecap] = useState<BlockRecap | null>(null);
  const [extraAdvice, setExtraAdvice] = useState<ExtraAdvice | null>(null);
  const [motivationalQuote, setMotivationalQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [goalEvents, setGoalEvents] = useState<TrainingSession[]>([]);
  const [indispoEvents, setIndispoEvents] = useState<TrainingSession[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const router = useRouter();

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [planData, profileData] = await Promise.all([
        apiClient<any>('/api/training-plan'),
        apiClient<{ profile: any }>('/api/profile')
      ]);

      // Traitement du plan
      if (!planData || typeof planData !== 'object') {
        throw new Error("Format de réponse du plan invalide.");
      }
      const mappedPlan = (planData.trainingPlan || []).map((session: any, index: number) => ({
        id: index,
        date: session.date,
        type: session.sessionType,
        name: session.title,
        distance: session.distance_km ? `${session.distance_km} km` : "",
        duration: session.duration_min ? `${session.duration_min} min` : "",
        description: session.description,
        details: session.details,
        rpe: session.rpe,
        intensity: session.intensity,
      }));
      setBlockSummary(planData.blockSummary || null);
      setPlan(mappedPlan);
      setBlockRecap(planData.blockRecap || null);
      setExtraAdvice(planData.extraAdvice || null);
      setMotivationalQuote(planData.motivationalQuote || null);

      // Traitement du profil
      const profile = profileData.profile || {};
      const events: TrainingSession[] = [];
      if (profile.goalDate && profile.goalName) {
        events.push({ id: "goal", date: profile.goalDate.slice(0, 10), type: "Objectif", name: profile.goalName, isGoal: true } as any);
      }
      if (Array.isArray(profile.secondaryObjectives)) {
        profile.secondaryObjectives.forEach((obj: any, idx: number) => {
          if (obj.date && obj.name) {
            events.push({ id: `secondary-goal-${idx}`, date: obj.date.slice(0, 10), type: "Objectif", name: obj.name, isGoal: true } as any);
          }
        });
      }
      setGoalEvents(events);
      const indispos: TrainingSession[] = (profile.unavailabilities || []).map((u: any, idx: number) => ({
        id: `indispo-${idx}`, date: u.date, type: "Indisponibilité", description: u.reason || "Indisponible", isIndispo: true,
      } as any));
      setIndispoEvents(indispos);

    } catch (err: any) {
      setError("Erreur : " + (err.message || "impossible de charger les données. Vérifiez que votre profil est complet."));
      setPlan([]);
    } finally {
      setLoading(false);
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setError(null);
    try {
      await apiClient("/api/training-plan/regenerate", { method: "POST" });
      await fetchInitialData(); // On recharge toutes les données
    } catch (error) {
      console.error("Failed to regenerate plan:", error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("La regénération du plan a échoué.");
      }
      setIsRegenerating(false);
    }
  };

  if (loading && !isRegenerating) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="ml-4 text-lg">Génération de votre plan en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 text-center">
         <h1 className="text-3xl font-bold text-gray-900">Mon plan d'entraînement</h1>
        <p className="text-red-600 bg-red-50 p-4 rounded-md">{error}</p>
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-fit"
          onClick={() => router.push("/onboarding")}
        >
          Compléter mon questionnaire
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Mon plan d'entraînement</h1>
        <p className="text-gray-600">Voici toutes les activités recommandées par l'IA selon votre profil et vos objectifs.</p>
        <div className="flex gap-2">
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-fit"
            onClick={() => router.push("/onboarding/questionnaire")}
          >
            Modifier mon questionnaire
          </button>
          <div>
            <button
              className="mt-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 w-fit flex items-center gap-2"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Régénération...
                </>
              ) : "Régénérer le plan"}
            </button>
          </div>
        </div>
      </div>

      {blockSummary && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">{blockSummary.title}</CardTitle>
            <p className="text-sm text-gray-500">{blockSummary.period}</p>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-gray-700">{blockSummary.mainFocus}</p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1 text-sm text-gray-600"><BarChart className="w-4 h-4" /> Intensité: <strong>{blockSummary.intensity}</strong></div>
              <div className="flex items-center gap-1 text-sm text-gray-600"><Target className="w-4 h-4" /> État de forme visé: <strong>{blockSummary.targetFormState}</strong></div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Calendrier d'entraînement</CardTitle>
        </CardHeader>
        <CardContent>
          {isRegenerating ? (
             <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="ml-4 text-lg">Génération de votre nouveau plan...</p>
            </div>
          ) : plan.length === 0 && goalEvents.length === 0 ? (
            <p>Aucune séance trouvée. Pensez à compléter votre profil.</p>
          ) : (
            <TrainingCalendar sessions={[...plan, ...goalEvents, ...indispoEvents]} />
          )}
        </CardContent>
      </Card>

      {blockRecap && (
         <Card>
          <CardHeader><CardTitle>Récapitulatif du bloc</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-semibold">Volumes hebdomadaires</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Semaine 1:</strong> {blockRecap.week1.volume_km} km / {blockRecap.week1.volume_hours}h</div>
                <div><strong>Semaine 2:</strong> {blockRecap.week2.volume_km} km / {blockRecap.week2.volume_hours}h</div>
              </div>
               <h3 className="font-semibold pt-2">Répartition de l'intensité</h3>
               <div className="w-full bg-gray-200 rounded-full h-4 flex overflow-hidden">
                 <div className="bg-green-500 h-4" style={{ width: `${blockRecap.intensityDistribution.zone1_2_percentage}%` }} title={`Z1-Z2: ${blockRecap.intensityDistribution.zone1_2_percentage}%`}></div>
                 <div className="bg-orange-500 h-4" style={{ width: `${blockRecap.intensityDistribution.zone3_4_percentage}%` }} title={`Z3-Z4: ${blockRecap.intensityDistribution.zone3_4_percentage}%`}></div>
                 <div className="bg-red-600 h-4" style={{ width: `${blockRecap.intensityDistribution.zone5_percentage}%` }} title={`Z5: ${blockRecap.intensityDistribution.zone5_percentage}%`}></div>
               </div>
            </div>
            <div>
              <h3 className="font-semibold">Compétences travaillées</h3>
              <ul className="list-disc list-inside text-gray-700">
                {blockRecap.skillsTargeted.map(skill => <li key={skill}>{skill}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {extraAdvice && (
        <Card>
           <CardHeader><CardTitle>Conseils complémentaires</CardTitle></CardHeader>
           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Heart className="w-5 h-5 text-red-500"/> Nutrition & Récupération</h3>
                <p className="text-sm text-gray-600 mt-2">{extraAdvice.nutrition}</p>
                <p className="text-sm text-gray-600 mt-2">{extraAdvice.recovery}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2"><Wind className="w-5 h-5 text-blue-500"/> Mental & Organisation</h3>
                <p className="text-sm text-gray-600 mt-2">{extraAdvice.stressManagement}</p>
                <p className="text-sm text-gray-600 mt-2">{extraAdvice.mentalPrep}</p>
              </div>
           </CardContent>
        </Card>
      )}
      
      {motivationalQuote && (
        <div className="mt-8 p-6 bg-gray-800 text-white rounded-lg text-center shadow-lg">
          <blockquote className="text-xl italic">
            "{motivationalQuote}"
          </blockquote>
        </div>
      )}
    </div>
  );
} 