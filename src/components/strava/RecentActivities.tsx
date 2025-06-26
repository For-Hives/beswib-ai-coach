"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const typeColors: Record<string, string> = {
  Endurance: "bg-green-100 text-green-800",
  Fractionné: "bg-red-100 text-red-800",
  Récupération: "bg-gray-200 text-gray-800",
  Long: "bg-purple-100 text-purple-800",
};

interface Activity {
  strava_id: string;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  start_date: string;
}

function getType(activity: Activity): string {
  if (activity.type === "Run" && activity.distance >= 20000) return "Long";
  if (activity.name?.toLowerCase().includes("fractionné")) return "Fractionné";
  if (activity.name?.toLowerCase().includes("récupération")) return "Récupération";
  return "Endurance";
}

function getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Hier";
  if (diff === 1) return "Il y a 1 jour";
  return `Il y a ${diff} jours`;
}

function getPace(activity: Activity): string {
  if (!activity.distance || !activity.moving_time) return "-";
  const pace = activity.moving_time / 60 / (activity.distance / 1000); // min/km
  const min = Math.floor(pace);
  const sec = Math.round((pace - min) * 60).toString().padStart(2, "0");
  return `${min}:${sec} min/km`;
}

function getFeedback(type: string): string {
  switch (type) {
    case "Endurance":
      return "Excellente séance ! Rythme parfaitement maîtrisé.";
    case "Fractionné":
      return "Bonne intensité sur les fractions. Récupération à améliorer.";
    case "Récupération":
      return "Parfait pour la récupération. Continuez ainsi !";
    case "Long":
      return "Belle sortie longue, attention à la gestion de l'effort.";
    default:
      return "Séance bien réalisée.";
  }
}

function getSportIcon(type: string) {
  switch (type) {
    case "Run": return "🏃";
    case "Ride": return "🚴";
    case "Swim": return "🏊";
    default: return "🏅";
  }
}

function getSportLabel(type: string) {
  switch (type) {
    case "Run": return "Course à pied";
    case "Ride": return "Vélo";
    case "Swim": return "Natation";
    default: return type;
  }
}

export default function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    axios.get(`${apiUrl}/api/strava/activities`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setActivities(res.data.slice(0, 5)))
      .catch(e => {
        if (e.response) {
          console.error(`Erreur API activities: ${e.response.status}`, e.response.data);
        } else {
          console.error(e);
        }
      });
  }, []);

  return (
    <div>
      <h2 className="font-bold text-lg">Activités récentes</h2>
      <p className="text-gray-500 mb-4">Dernières séances avec feedback IA</p>
      <div className="space-y-4">
        {activities.map((act) => {
          return (
            <Card key={act.strava_id} className="">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getSportIcon(act.type)}</span>
                  <span className="font-semibold text-gray-800">{getSportLabel(act.type)}</span>
                  <span className="text-xs text-gray-500 ml-auto">{getRelativeDate(act.start_date)}</span>
                </div>
                <div className="flex gap-6 text-sm text-gray-700 mb-2">
                  <span>{(act.distance/1000).toFixed(1)} km</span>
                  <span>🕒 {Math.round(act.moving_time/60)} min</span>
                  <span>⚡ {getPace(act)}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-purple-100 text-purple-800">IA</Badge>
                  <span className="text-sm text-gray-700">{getFeedback(act.type)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 