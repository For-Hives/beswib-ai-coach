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

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/strava/summary", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setSummary);

    fetch("/api/strava/activities", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setActivities);

    fetch("/api/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setGoal);

    // Récupère le volume du mois précédent
    fetch("/api/strava/summary?prevMonth=1", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setPrevMonth(data?.month?.distance || 0));
  }, []);

  // Calculs
  const kmThisMonth = summary?.month?.distance ? (summary.month.distance / 1000).toFixed(0) : 0;
  const nSessions = activities.filter(a => a.start_date?.slice(0, 7) === new Date().toISOString().slice(0, 7)).length;
  const nSessionsPlanned = 20; // à adapter si tu as un plan
  const percentSessions = nSessionsPlanned ? Math.round((nSessions / nSessionsPlanned) * 100) : 0;
  const progression = prevMonth ? Math.round(((summary?.month?.distance - prevMonth) / prevMonth) * 100) : 0;
  const weeksLeft = goal?.weeksLeft || 12; // à calculer selon la date d'objectif
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
