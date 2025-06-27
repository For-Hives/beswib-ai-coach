"use client";
import { useEffect, useState } from "react";
import { TrainingCalendar, TrainingSession } from "@/components/calendar/training-calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import apiClient, { ApiError } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<TrainingSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [stravaActs, summaryData, profileData, planData] = await Promise.all([
          apiClient<any[]>("/api/strava/activities"),
          apiClient<any>("/api/strava/summary"),
          apiClient<{ profile: any }>("/api/profile"),
          apiClient<any>('/api/training-plan'),
        ]);

        const stravaSessions = (stravaActs || []).map(stravaToSession);
        
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
        setPlan(mappedPlan);
        
        setSessions(stravaSessions);
        setSummary(summaryData);
        
        const currentProfile = profileData.profile || {};
        setProfile(currentProfile);
        setUnavailabilities(currentProfile.unavailabilities || []);
        
        const events: TrainingSession[] = [];
        if (currentProfile.goalDate && currentProfile.goalName) {
          events.push({ 
            id: "goal", 
            date: currentProfile.goalDate.slice(0, 10), 
            type: "Objectif", 
            name: currentProfile.goalName, 
            isGoal: true,
            distance: currentProfile.goalDistance ? `${currentProfile.goalDistance} km` : undefined,
            elevation: currentProfile.goalElevation ? currentProfile.goalElevation : undefined,
            timeGoal: currentProfile.goalPerformance ? currentProfile.goalPerformance : undefined,
            description: `Objectif principal: ${currentProfile.goalName}`
          } as any);
        }
        if (Array.isArray(currentProfile.secondaryObjectives)) {
          currentProfile.secondaryObjectives.forEach((obj: any, idx: number) => {
            if (obj.date && obj.name) {
              events.push({ 
                id: `secondary-goal-${idx}`, 
                date: obj.date.slice(0, 10), 
                type: "Objectif", 
                name: obj.name, 
                isGoal: true,
                distance: obj.distance ? `${obj.distance} km` : undefined,
                elevation: obj.elevation ? obj.elevation : undefined,
                timeGoal: obj.timeGoal ? obj.timeGoal : undefined,
                description: `Objectif secondaire: ${obj.name}`
              } as any);
            }
          });
        }
        setGoalEvents(events);

      } catch (err) {
        console.error("Erreur de chargement des données du calendrier", err);
        setError("Impossible de charger les données. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const indispoEvents: TrainingSession[] = unavailabilities.map((u, idx) => ({
    id: `indispo-${idx}`,
    date: u.date,
    type: "Indisponibilité",
    distance: "",
    duration: "",
    description: u.reason || "Indisponible",
    isIndispo: true,
  } as any));

  const allEvents = [...plan, ...sessions, ...goalEvents, ...indispoEvents];

  useEffect(() => {
    const sessionId = searchParams.get('sessionId');
    if (sessionId && allEvents.length > 0) {
      const session = allEvents.find(s => String(s.id) === sessionId);
      if (session) {
        setSelectedSession(session);
        router.replace('/calendar', { scroll: false });
      }
    }
  }, [allEvents, searchParams, router]);

  const saveUnavailabilities = async (newUnav: { date: string; reason?: string }[]) => {
    if (!profile) return;
    try {
      const updatedProfile = { ...profile, unavailabilities: newUnav };
      await apiClient("/api/save-profile", {
        method: "POST",
        body: JSON.stringify(updatedProfile),
      });
      setUnavailabilities(newUnav);
      setProfile(updatedProfile); // Met à jour le profil local pour rester synchronisé
    } catch(err) {
      console.error("Erreur lors de la sauvegarde de l'indisponibilité", err);
      // Idéalement, afficher un feedback à l'utilisateur ici
    }
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

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Calendrier d'entraînement</h1>
        <p className="text-gray-600">Planifiez et suivez vos séances d'entraînement</p>
      </div>
      <Button className="mb-2" variant="outline" onClick={() => setAddIndispoOpen(true)}>Ajouter une indisponibilité</Button>
      <TrainingCalendar 
        sessions={allEvents} 
        onDeleteIndispo={handleDeleteIndispo}
        onEventClick={(session) => setSelectedSession(session)}
      />
      
      {/* Modal pour les détails de la session */}
      {selectedSession && (
        <Dialog open={!!selectedSession} onOpenChange={(isOpen) => !isOpen && setSelectedSession(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedSession.name || selectedSession.type}</DialogTitle>
              <div className="text-sm text-gray-500 pt-1">
                {new Date(selectedSession.date).toLocaleDateString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {selectedSession.isGoal ? (
                <>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">Distance</h4>
                      <p className="text-gray-600">{selectedSession.distance || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Dénivelé</h4>
                      <p className="text-gray-600">{selectedSession.elevation ? `${selectedSession.elevation} m` : 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Objectif de temps</h4>
                      <p className="text-gray-600">{selectedSession.timeGoal || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Type</h4>
                      <p className="text-gray-600">{selectedSession.type}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h4 className="font-semibold text-gray-800">Description</h4>
                    <p className="text-gray-600">{selectedSession.description}</p>
                  </div>
                  {selectedSession.details && (
                    <div>
                      <h4 className="font-semibold text-gray-800">Détails de la séance</h4>
                      <p className="text-gray-600 whitespace-pre-wrap">{selectedSession.details}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">Distance</h4>
                      <p className="text-gray-600">{selectedSession.distance || '-'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Durée</h4>
                      <p className="text-gray-600">{selectedSession.duration || '-'}</p>
                    </div>
                    {selectedSession.rpe && (
                      <div>
                        <h4 className="font-semibold text-gray-800">Intensité (RPE)</h4>
                        <p className="text-gray-600">{selectedSession.rpe ? `${selectedSession.rpe}/10` : '-'}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-800">Type</h4>
                      <p className="text-gray-600">{selectedSession.type}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

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
