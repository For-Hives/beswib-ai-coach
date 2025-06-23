"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainingCalendar, TrainingSession } from "@/components/calendar/training-calendar";

export default function TrainingPlanPage() {
  const [plan, setPlan] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/training-plan")
      .then((res) => res.json())
      .then((data) => {
        setPlan(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Mon plan d'entraînement</h1>
        <p className="text-gray-600">Voici toutes les activités recommandées par l'IA selon votre profil et vos objectifs.</p>
      </div>
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
    </div>
  );
} 