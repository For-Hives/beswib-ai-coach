"use client";
import { useEffect, useState } from "react";
import { TrainingCalendar, TrainingSession } from "@/components/calendar/training-calendar";

function stravaToSession(act: any): TrainingSession {
  let type = "Endurance";
  if (act.type === "Run" && act.distance >= 20000) type = "Long";
  if (act.name?.toLowerCase().includes("fractionné")) type = "Fractionné";
  if (act.name?.toLowerCase().includes("récupération")) type = "Récupération";
  const date = act.start_date?.slice(0, 10);
  return {
    id: act.strava_id,
    date,
    type,
    distance: `${(act.distance/1000).toFixed(1)} km`,
    duration: `${Math.round(act.moving_time/60)} min`,
    description: act.name,
    completed: true,
    details: "Séance importée de Strava",
    average_speed: act.average_speed,
    average_heartrate: act.average_heartrate,
  };
}

function formatDuration(seconds: number) {
  const min = Math.floor(seconds / 60);
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h${m.toString().padStart(2, "0")}` : `${m} min`;
}

export default function CalendarPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/strava/activities", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then((stravaActs) => {
        const stravaSessions = (stravaActs || []).map(stravaToSession);
        setSessions(stravaSessions);
      });
    fetch("/api/strava/summary", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setSummary);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Calendrier d'entraînement</h1>
        <p className="text-gray-600">Planifiez et suivez vos séances d'entraînement</p>
      </div>
      {summary && (
        <div className="flex gap-8 mb-4">
          <div>
            <div className="text-gray-500 text-sm">Volume hebdo</div>
            <div className="font-bold">{(summary.week.distance/1000).toFixed(1)} km</div>
            <div className="text-gray-500 text-sm">{formatDuration(summary.week.duration)}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Volume mensuel</div>
            <div className="font-bold">{(summary.month.distance/1000).toFixed(1)} km</div>
            <div className="text-gray-500 text-sm">{formatDuration(summary.month.duration)}</div>
          </div>
        </div>
      )}
      <TrainingCalendar sessions={sessions} />
    </div>
  );
}
