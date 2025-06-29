"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { User, Activity, Mountain, Dumbbell, Calendar, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function getDaysTo(dateStr: string) {
  if (!dateStr) return "-";
  const now = new Date();
  const target = new Date(dateStr);
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? `${diff} jours` : diff === 0 ? "Aujourd'hui" : "-";
}

export default function CardProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.profile);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;

  // Discipline pour records dynamiques
  const discipline = profile?.discipline?.toLowerCase();

  // Records dynamiques (nouveaux champs)
  let records = null;
  if (discipline === "running" || discipline === "trail" || discipline === "triathlon") {
    records = (
      <>
        <div><b>Record 10km :</b> {profile?.record10k || '-'}</div>
        <div><b>Test VMA/FTP :</b> {profile?.vmaOrFtp || '-'}</div>
        <div><b>Durée max effort :</b> {profile?.maxEffortDuration ? profile.maxEffortDuration + ' min' : '-'}</div>
      </>
    );
  } else if (discipline === "cyclisme" || discipline === "cycling") {
    records = (
      <>
        <div><b>FTP :</b> {profile?.cyclingFTP || profile?.vmaOrFtp || '-'}</div>
        <div><b>Test FTP/PMA :</b> {profile?.cyclingTestDone || '-'}</div>
        <div><b>Durée max effort :</b> {profile?.maxEffortDuration ? profile.maxEffortDuration + ' min' : '-'}</div>
      </>
    );
  }

  // Variables spécifiques (exemple trail)
  const montagne = profile?.trailMountainAccess || profile?.trailMountainTraining || '-';
  const renfo = profile?.trailStrength || profile?.trailStrengthTraining || '-';
  const materiel = [
    profile?.runningTrackAccess,
    profile?.cyclingHomeTrainer,
    profile?.trailBaroGps,
    profile?.runningGpsWatch,
    profile?.triathlonPoolAccess,
    profile?.triathlonBikeAccess
  ].filter(Boolean).join(', ') || '-';

  // Objectif principal et date (nouveaux champs)
  const objectif = profile?.runningGoal || profile?.trailGoal || profile?.cyclingGoal || profile?.triathlonFormat || profile?.goalName || '-';
  const objectifDate = profile?.runningGoalDate || profile?.trailGoalDate || profile?.cyclingGoalDate || profile?.triathlonDate || profile?.goalDate || '';
  const joursAvantObjectif = getDaysTo(objectifDate);
  const freq = profile?.runningFrequency || profile?.trailFrequency || profile?.cyclingFrequency || profile?.triathlonFrequency || '-';

  // Ajout du calcul des zones cardiaques
  const fcMax = parseInt(profile?.maxHeartRate);
  const fcRepos = parseInt(profile?.restingHeartRate);
  let zones = null;
  if (!isNaN(fcMax) && !isNaN(fcRepos)) {
    const calc = (pct: number) => Math.round(fcRepos + (fcMax - fcRepos) * pct);
    zones = [
      {
        name: "Z1 - Récupération",
        range: "55% à 72%",
        min: calc(0.55),
        max: calc(0.72),
      },
      {
        name: "Z2 - Endurance fondamentale",
        range: "73% à 80%",
        min: calc(0.73),
        max: calc(0.80),
      },
      {
        name: "Z3 - Seuil",
        range: "80% à 87%",
        min: calc(0.80),
        max: calc(0.87),
      },
      {
        name: "Z4 - Tempo",
        range: "87% à 92%",
        min: calc(0.87),
        max: calc(0.92),
      },
      {
        name: "Z5 - VO2Max",
        range: "92% à 105%",
        min: calc(0.92),
        max: calc(1.05),
      },
    ];
  }

  // Nouveaux blocs d'infos enrichies
  const sommeil = profile?.sleepHours || profile?.sleepQuality ? `${profile.sleepHours || '-'} h / Qualité: ${profile.sleepQuality || '-'}` : '-';
  const nutrition = profile?.dietType || profile?.hydrationHabits ? `${profile.dietType || '-'} / ${profile.hydrationHabits || '-'} L/j` : '-';
  const chargeMentale = profile?.mentalLoad || '-';
  const stress = profile?.dailyStress || '-';
  const recup = profile?.recoveryRoutines?.length ? profile.recoveryRoutines.join(', ') : '-';

  return (
    <>
      <div className="flex gap-4 border-b mb-6">
        <Link href="/profile" className={pathname === "/profile" ? "font-bold border-b-2 border-blue-600 pb-2" : "pb-2"}>Synthèse</Link>
        <Link href="/profile/card" className={pathname === "/profile/card" ? "font-bold border-b-2 border-blue-600 pb-2" : "pb-2"}>Card</Link>
        <Link href="/profile/settings" className={pathname === "/profile/settings" ? "font-bold border-b-2 border-blue-600 pb-2" : "pb-2"}>Paramètres</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Haut gauche */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.avatar || "/placeholder.svg?height=96&width=96"} />
              {!profile?.avatar && (
                <AvatarFallback className="text-2xl">
                  {(profile?.firstName?.[0] || "") + (profile?.lastName?.[0] || "")}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle>{profile?.firstName} {profile?.lastName}</CardTitle>
              <div className="text-gray-500 text-sm">{profile?.age ? `${profile.age} ans` : "-"} • {profile?.gender || "-"}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div><b>Taille :</b> {profile?.height || '-'}</div>
            <div><b>Poids :</b> {profile?.weight || '-'}</div>
            <div><b>FC max :</b> {profile?.maxHeartRate || '-'}</div>
            <div><b>FC repos :</b> {profile?.restingHeartRate || '-'}</div>
            <div><b>Expérience :</b> {profile?.runningExperience || profile?.trailExperience || profile?.cyclingExperience || profile?.triathlonSwimLevel || '-'}</div>
            <div><b>Sommeil :</b> {sommeil}</div>
            <div><b>Récupération :</b> {recup}</div>
            <div><b>Charge mentale :</b> {chargeMentale}</div>
            <div><b>Stress quotidien :</b> {stress}</div>
          </CardContent>
        </Card>

        {/* Haut droite */}
        <Card>
          <CardHeader>
            <CardTitle>Sport & Antécédents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div><b>Discipline principale :</b> {profile?.discipline || '-'}</div>
            <div><b>Type d'alimentation :</b> {nutrition}</div>
            <div><b>Objectif principal :</b> {objectif}</div>
            <div><b>Date objectif :</b> {objectifDate || '-'}</div>
            <div><b>Jours avant objectif :</b> {joursAvantObjectif}</div>
            <div><b>Fréquence d'entraînement :</b> {freq}</div>
            {records}
          </CardContent>
        </Card>

        {/* Bas gauche */}
        <Card>
          <CardHeader>
            <CardTitle>Spécificités & Matériel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div><b>Montagne possible :</b> {montagne}</div>
            <div><b>Renforcement OK :</b> {renfo}</div>
            <div><b>Matériel :</b> {materiel}</div>
          </CardContent>
        </Card>

        {/* Bas droite */}
        <Card>
          <CardHeader>
            <CardTitle>Vie & Bien-être</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div><b>Jours disponibles :</b> {profile?.availableDays || '-'}</div>
            <div><b>Jours imprévisibles :</b> {profile?.unpredictableDays || '-'}</div>
            <div><b>Engagements :</b> {profile?.commitments || '-'}</div>
            <div><b>Motivation :</b> {profile?.motivationLevel || '-'}</div>
            <div><b>Objectifs secondaires :</b> {profile?.secondaryGoals || '-'}</div>
            <div><b>Attentes coach IA :</b> {profile?.coachExpectations || '-'}</div>
          </CardContent>
        </Card>
      </div>
      {/* Bloc zones cardiaques */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Zones cardiaques (calculées)</CardTitle>
          </CardHeader>
          <CardContent>
            {zones ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left">Zone</th>
                      <th className="px-3 py-2 text-left">% Intensité</th>
                      <th className="px-3 py-2 text-left">Plage FC cible (bpm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones.map((z, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2 font-medium">{z.name}</td>
                        <td className="px-3 py-2">{z.range}</td>
                        <td className="px-3 py-2">{z.min} – {z.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500">Renseignez votre FC max et FC de repos pour voir vos zones cardiaques.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
} 