"use client";
import { useEffect, useState } from "react";
import { TrainingCalendar, TrainingSession } from "@/components/calendar/training-calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
  const [goalEvents, setGoalEvents] = useState<TrainingSession[]>([]);
  const [unavailabilities, setUnavailabilities] = useState<{ date: string; reason?: string }[]>([]);
  const [addIndispoOpen, setAddIndispoOpen] = useState(false);
  const [indispoDraft, setIndispoDraft] = useState<{ date: string; reason: string }>({ date: '', reason: '' });
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    console.log('Début useEffect /calendar');
    const token = localStorage.getItem("token");
    console.log('Token:', token);
    fetch("/api/strava/activities", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => { console.log('Réponse /api/strava/activities:', r); return r.json(); })
      .then((stravaActs) => {
        console.log('Data /api/strava/activities:', stravaActs);
        const stravaSessions = (stravaActs || []).map(stravaToSession);
        setSessions(stravaSessions);
      });
    fetch("/api/strava/summary", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => { console.log('Réponse /api/strava/summary:', r); return r.json(); })
      .then(data => { console.log('Data /api/strava/summary:', data); setSummary(data); });
    fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => { console.log('Réponse /api/profile:', res); return res.json(); })
      .then(data => {
        console.log('Data /api/profile:', data);
        const profile = data.profile || {};
        setProfile(profile);
        setUnavailabilities(profile.unavailabilities || []);
        const events: TrainingSession[] = [];
        if (profile.goalDate && profile.goalName) {
          events.push({
            id: "goal",
            date: profile.goalDate.slice(0, 10),
            type: "Objectif",
            name: profile.goalName,
            distance: profile.goalDistance ? String(profile.goalDistance) : undefined,
            elevation: profile.goalElevation ? String(profile.goalElevation) : undefined,
            timeGoal: profile.goalPerformance || undefined,
            description: "Objectif principal",
            isGoal: true,
          } as any);
        }
        if (Array.isArray(profile.secondaryObjectives)) {
          profile.secondaryObjectives.forEach((obj: any, idx: number) => {
            if (obj.date && obj.name) {
              events.push({
                id: `secondary-goal-${idx}`,
                date: obj.date.slice(0, 10),
                type: "Objectif",
                name: obj.name,
                distance: obj.distance ? String(obj.distance) : undefined,
                elevation: obj.elevation ? String(obj.elevation) : undefined,
                timeGoal: obj.timeGoal || undefined,
                description: "Objectif secondaire",
                isGoal: true,
              } as any);
            }
          });
        }
        setGoalEvents(events);
      });
  }, []);

  // Ajout/suppression d'indisponibilité
  const saveUnavailabilities = async (newUnav: { date: string; reason?: string }[]) => {
    if (!profile) return;
    const token = localStorage.getItem("token");
    await fetch("/api/save-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...profile, unavailabilities: newUnav }),
    });
    setUnavailabilities(newUnav);
    setProfile((p: any) => ({ ...p, unavailabilities: newUnav }));
  };

  const handleAddIndispo = async () => {
    const newUnav = [...unavailabilities, { date: indispoDraft.date, reason: indispoDraft.reason }];
    await saveUnavailabilities(newUnav);
    setAddIndispoOpen(false);
    setIndispoDraft({ date: '', reason: '' });
  };
  const handleDeleteIndispo = async (date: string) => {
    const newUnav = unavailabilities.filter(u => u.date !== date);
    await saveUnavailabilities(newUnav);
  };

  // Injection dans le calendrier
  const indispoEvents: TrainingSession[] = unavailabilities.map((u, idx) => ({
    id: `indispo-${idx}`,
    date: u.date,
    type: "Indisponibilité",
    distance: "",
    duration: "",
    description: u.reason || "Indisponible",
    isIndispo: true,
  } as any));

  console.log('Rendu /calendar', { sessions, summary, goalEvents, unavailabilities, profile });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Calendrier d'entraînement</h1>
        <p className="text-gray-600">Planifiez et suivez vos séances d'entraînement</p>
      </div>
      <Button className="mb-2" variant="outline" onClick={() => setAddIndispoOpen(true)}>Ajouter une indisponibilité</Button>
      <TrainingCalendar sessions={[...sessions, ...goalEvents, ...indispoEvents]} onDeleteIndispo={handleDeleteIndispo} />
      <Dialog open={addIndispoOpen} onOpenChange={setAddIndispoOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ajouter une indisponibilité</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <label>Date</label>
            <Input type="date" value={indispoDraft.date} onChange={e => setIndispoDraft(d => ({ ...d, date: e.target.value }))} />
            <label>Motif (optionnel)</label>
            <Input value={indispoDraft.reason} onChange={e => setIndispoDraft(d => ({ ...d, reason: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setAddIndispoOpen(false)}>Annuler</Button>
            <Button onClick={handleAddIndispo} disabled={!indispoDraft.date}>Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
