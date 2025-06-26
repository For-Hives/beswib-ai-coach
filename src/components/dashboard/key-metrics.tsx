"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MapPin, Target, Trophy, TrendingUp } from "lucide-react"

export default function KeyMetrics() {
  const [summary, setSummary] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [prevMonth, setPrevMonth] = useState<number>(0);
  const [goal, setGoal] = useState<any>(null);
  const [trainingPlan, setTrainingPlan] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    fetch(`${apiUrl}/api/strava/summary`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => {
        if (!r.ok) throw new Error(`Erreur API summary: ${r.status}`);
        return r.json();
      })
      .then(setSummary)
      .catch(e => console.error(e));

    fetch(`${apiUrl}/api/strava/activities`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => {
        if (!r.ok) throw new Error(`Erreur API activities: ${r.status}`);
        return r.json();
      })
      .then(setActivities)
      .catch(e => console.error(e));

    fetch("/api/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => {
        if (!r.ok) throw new Error(`Erreur API profile: ${r.status}`);
        return r.json();
      })
      .then(setGoal)
      .catch(e => console.error(e));

    // Récupère le volume du mois précédent
    fetch(`${apiUrl}/api/strava/summary?prevMonth=1`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => {
        if (!r.ok) throw new Error(`Erreur API summary prevMonth: ${r.status}`);
        return r.json();
      })
      .then(data => setPrevMonth(data?.month?.distance || 0))
      .catch(e => console.error(e));

    // Ajout fetch du training plan pour la date objectif
    fetch("/api/training-plan", { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => {
        if (!r.ok) throw new Error(`Erreur API training-plan: ${r.status}`);
        return r.json();
      })
      .then(data => {
        try {
          const plan = typeof data.text === "string" ? JSON.parse(data.text).plan : [];
          setTrainingPlan(plan);
        } catch (e) {
          setTrainingPlan([]);
        }
      })
      .catch(e => console.error(e));
  }, []);

  // Calculs
  const kmThisMonth = summary?.month?.distance ? (summary.month.distance / 1000).toFixed(0) : 0;
  const nSessions = activities.filter(a => a.start_date?.slice(0, 7) === new Date().toISOString().slice(0, 7)).length;
  const nSessionsPlanned = 20; // à adapter si tu as un plan
  const percentSessions = nSessionsPlanned ? Math.round((nSessions / nSessionsPlanned) * 100) : 0;
  const progression = prevMonth ? Math.round(((summary?.month?.distance - prevMonth) / prevMonth) * 100) : 0;

  // Correction du calcul des semaines restantes
  // On privilégie la date de la dernière séance du plan si dispo
  let objectifDate = null;
  if (trainingPlan.length > 0) {
    objectifDate = trainingPlan[trainingPlan.length - 1].date;
  } else {
    objectifDate = goal?.runningGoalDate || goal?.trailRaceDate || goal?.cyclingGoalDate || goal?.triathlonDate;
  }
  function getWeeksLeft(dateStr: string) {
    if (!dateStr) return "-";
    const now = new Date();
    const target = new Date(dateStr);
    const diff = (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7);
    return diff > 0 ? Math.ceil(diff) : 0;
  }
  const weeksLeft = getWeeksLeft(objectifDate);

  const percentGoal = 78; // à calculer selon ta logique

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métriques clés</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Km totaux</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">{kmThisMonth}</span>
          </div>
          <p className="text-xs text-gray-600">Ce mois-ci</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Séances réalisées</span>
            </div>
            <span className="text-2xl font-bold text-green-600">{nSessions}/{nSessionsPlanned}</span>
          </div>
          <Progress value={percentSessions} className="h-2" />
          <p className="text-xs text-gray-600">{percentSessions}% de réussite</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Objectif Marathon</span>
            </div>
            <span className="text-2xl font-bold text-purple-600">{percentGoal}%</span>
          </div>
          <Progress value={percentGoal} className="h-2" />
          <p className="text-xs text-gray-600">{weeksLeft} semaines restantes</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium">Progression</span>
            </div>
            <span className="text-2xl font-bold text-orange-600">{progression > 0 ? "+" : ""}{progression}%</span>
          </div>
          <p className="text-xs text-gray-600">Amélioration ce mois</p>
        </div>
      </CardContent>
    </Card>
  )
}
