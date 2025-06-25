"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { User, Activity, Mountain, Dumbbell, Calendar, Target, Trophy } from "lucide-react";

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

  // Records dynamiques
  let records = null;
  if (discipline === "running" || discipline === "trail" || discipline === "triathlon") {
    records = (
      <>
        <div><b>Record 10km :</b> {profile?.best10k || '-'}</div>
        <div><b>Record semi :</b> {profile?.bestHalf || '-'}</div>
        <div><b>Record marathon :</b> {profile?.bestMarathon || '-'}</div>
      </>
    );
  } else if (discipline === "cyclisme" || discipline === "cycling") {
    records = (
      <>
        <div><b>Record 50km :</b> (à venir via Strava)</div>
        <div><b>Record 100km :</b> (à venir via Strava)</div>
        <div><b>Record 200km :</b> (à venir via Strava)</div>
        <div><b>Plus gros dénivelé :</b> (à venir via Strava)</div>
      </>
    );
  }

  // Variables spécifiques (exemple trail)
  const montagne = profile?.trailMountainTraining;
  const renfo = profile?.trailStrengthTraining;
  const materiel = profile?.material || profile?.runningTrackAccess || profile?.cyclingHomeTrainer || profile?.trailGpsWatch || profile?.triathlonPoolAccess || profile?.triathlonBikeAccess;

  // Objectif principal et date
  const objectif = profile?.runningGoal || profile?.trailRaceGoal || profile?.cyclingGoal || profile?.triathlonFormat || '-';
  const objectifDate = profile?.runningGoalDate || profile?.trailRaceDate || profile?.cyclingGoalDate || profile?.triathlonDate || '';
  const joursAvantObjectif = getDaysTo(objectifDate);
  const freq = profile?.weeklyVolume || profile?.runningFrequency || profile?.trailFrequency || profile?.cyclingFrequency || profile?.triathlonFrequency || '-';

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

  return (
    <>
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
            <div><b>Expérience :</b> {profile?.experience || profile?.runningExperience || profile?.trailExperience || profile?.cyclingExperience || profile?.triathlonSwimLevel || '-'}</div>
          </CardContent>
        </Card>

        {/* Haut droite */}
        <Card>
          <CardHeader>
            <CardTitle>Sport & Antécédents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div><b>Discipline principale :</b> {profile?.discipline || '-'}</div>
            <div><b>Antécédents sportifs :</b> {profile?.sportsBackground || '-'}</div>
            <div><b>Volume mensuel :</b> (à venir via Strava)</div>
            {records}
          </CardContent>
        </Card>

        {/* Bas gauche */}
        <Card>
          <CardHeader>
            <CardTitle>Spécificités & Matériel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div><b>Montagne possible :</b> {montagne || '-'}</div>
            <div><b>Renforcement OK :</b> {renfo || '-'}</div>
            <div><b>Matériel :</b> {materiel || '-'}</div>
          </CardContent>
        </Card>

        {/* Bas droite */}
        <Card>
          <CardHeader>
            <CardTitle>Objectifs & Entraînement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div><b>Objectif principal :</b> {objectif}</div>
            <div><b>Date objectif :</b> {objectifDate || '-'}</div>
            <div><b>Jours avant objectif :</b> {joursAvantObjectif}</div>
            <div><b>Fréquence d'entraînement :</b> {freq}</div>
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