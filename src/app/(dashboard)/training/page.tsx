"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainingCalendar, TrainingSession } from "@/components/calendar/training-calendar";
import { useRouter } from "next/navigation";

export default function TrainingPlanPage() {
  const [plan, setPlan] = useState<TrainingSession[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/training-plan", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || 'Erreur inconnue');
        }
        return res.json();
      })
      .then((data) => {
        console.log("API training-plan response:", data);
        if (!data.text) {
          setSummary("Erreur : impossible de générer le plan (profil incomplet ou problème d'authentification).");
          setPlan([]);
          setAdvice([]);
          setLoading(false);
          return;
        }
        let text = data.text.trim();
        if (text.startsWith("```json")) {
          text = text.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (text.startsWith("```") ) {
          text = text.replace(/^```/, "").replace(/```$/, "").trim();
        }
        text = text.split('\n').filter((line: any) => !line.trim().startsWith('//')).join('\n');
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          text = text.substring(firstBrace, lastBrace + 1);
        }
        // Nettoie les virgules en trop avant ] ou }
        text = text.replace(/,(\s*[}\]])/g, '$1');
        console.log("Réponse brute Gemini :", text);
        const aiResult = JSON.parse(text);
        console.log("aiResult keys:", Object.keys(aiResult));
        setSummary(aiResult.summary || aiResult.objectif || "");
        setPlan(Array.isArray(aiResult.plan) ? aiResult.plan : []);
        setAdvice(
          Array.isArray(aiResult.conseils)
            ? aiResult.conseils
            : Array.isArray(aiResult.advice)
              ? aiResult.advice
              : Array.isArray(aiResult.tips)
                ? aiResult.tips
                : []
        );
        setLoading(false);
      })
      .catch((err) => {
        setSummary("Erreur : " + (err.message || "impossible de générer le plan (profil incomplet ou problème d'authentification)."));
        setPlan([]);
        setAdvice([]);
        setLoading(false);
      });
  }, []);

  const handleRegenerate = async () => {
    const token = localStorage.getItem("token");
    await fetch("/api/training-plan/regenerate", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    window.location.reload();
  };

  return (
    <div className="space-y-6">
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
          <button
            className="mt-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 w-fit"
            onClick={handleRegenerate}
          >
            Régénérer le plan
          </button>
        </div>
      </div>
      {summary && (
        <div className="mb-4 p-4 bg-blue-50 rounded">
          <p>{summary}</p>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Résumé du plan</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Chargement...</p>
          ) : plan.length === 0 ? (
            <p>Aucune séance trouvée.</p>
          ) : (
            <TrainingCalendar sessions={plan} />
          )}
        </CardContent>
      </Card>
      {advice.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded">
          <h2 className="text-lg font-bold mb-2">Conseils personnalisés</h2>
          <ul className="list-disc pl-6 space-y-1">
            {advice.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 