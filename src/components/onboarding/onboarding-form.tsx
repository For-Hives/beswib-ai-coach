"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Activity, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface OnboardingData {
  // Étape 1 - Physiologie
  age: string;
  gender: string;
  height: string;
  weight: string;
  maxHeartRate: string;
  restingHeartRate: string;
  // Étape 2 - Antécédents sportifs
  sportsBackground: string;
  weeklyVolume: string;
  best10k: string;
  bestHalf: string;
  bestMarathon: string;
  injuries: string;
  // Étape 3 - Discipline
  discipline: string;
  // Étape 4 - Running
  runningGoal: string;
  runningGoalTime: string;
  runningGoalDate: string;
  runningExperience: string;
  runningPace: string;
  runningFrequency: string;
  runningRecentRace: string;
  runningTrackAccess: string;
  runningSessionStyle: string[];
  // Étape 4 - Trail
  trailRaceGoal: string;
  trailRaceDate: string;
  trailExperience: string;
  trailWeeklyVolume: string;
  trailFrequency: string;
  trailMountainTraining: string;
  trailLongDescents: string;
  trailUphillAccess: string;
  trailJointIssues: string;
  trailStrengthTraining: string;
  trailGpsWatch: string;
  // Étape 4 - Cyclisme
  cyclingGoal: string;
  cyclingGoalDate: string;
  cyclingExperience: string;
  cyclingFTP: string;
  cyclingFrequency: string;
  cyclingHomeTrainer: string;
  cyclingPracticeType: string[];
  cyclingLongSessions: string;
  cyclingPreferences: string[];
  cyclingPowerMeter: string;
  cyclingTestDone: string;
  cyclingIssues: string;
  // Étape 4 - Triathlon
  triathlonFormat: string;
  triathlonDate: string;
  triathlonFrequency: string;
  triathlonDistribution: string;
  triathlonSwimLevel: string;
  triathlonBikeLevel: string;
  triathlonRunLevel: string;
  triathlonPriority: string;
  triathlonPoolAccess: string;
  triathlonBikeAccess: string;
  triathlonHeartRateMonitor: string;
  triathlonPowerMeter: string;
  triathlonAlreadyDone: string;
  triathlonAlreadyDoneFormat: string;
  triathlonConstraints: string;
  // Étape 5 - Consentements
  dataUsageConsent: boolean;
  notificationConsent: boolean;
}

const initialData: OnboardingData = {
  age: "",
  gender: "",
  height: "",
  weight: "",
  maxHeartRate: "",
  restingHeartRate: "",
  sportsBackground: "",
  weeklyVolume: "",
  best10k: "",
  bestHalf: "",
  bestMarathon: "",
  injuries: "",
  discipline: "",
  runningGoal: "",
  runningGoalTime: "",
  runningGoalDate: "",
  runningExperience: "",
  runningPace: "",
  runningFrequency: "",
  runningRecentRace: "",
  runningTrackAccess: "",
  runningSessionStyle: [],
  trailRaceGoal: "",
  trailRaceDate: "",
  trailExperience: "",
  trailWeeklyVolume: "",
  trailFrequency: "",
  trailMountainTraining: "",
  trailLongDescents: "",
  trailUphillAccess: "",
  trailJointIssues: "",
  trailStrengthTraining: "",
  trailGpsWatch: "",
  cyclingGoal: "",
  cyclingGoalDate: "",
  cyclingExperience: "",
  cyclingFTP: "",
  cyclingFrequency: "",
  cyclingHomeTrainer: "",
  cyclingPracticeType: [],
  cyclingLongSessions: "",
  cyclingPreferences: [],
  cyclingPowerMeter: "",
  cyclingTestDone: "",
  cyclingIssues: "",
  triathlonFormat: "",
  triathlonDate: "",
  triathlonFrequency: "",
  triathlonDistribution: "",
  triathlonSwimLevel: "",
  triathlonBikeLevel: "",
  triathlonRunLevel: "",
  triathlonPriority: "",
  triathlonPoolAccess: "",
  triathlonBikeAccess: "",
  triathlonHeartRateMonitor: "",
  triathlonPowerMeter: "",
  triathlonAlreadyDone: "",
  triathlonAlreadyDoneFormat: "",
  triathlonConstraints: "",
  dataUsageConsent: false,
  notificationConsent: false,
};

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [showGenerating, setShowGenerating] = useState(false);
  const router = useRouter();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof OnboardingData, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    setShowGenerating(true);

    // Récupère le token JWT du localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      setShowGenerating(false);
      alert("Utilisateur non authentifié !");
      return;
    }

    // Décode le JWT pour récupérer l'email
    const payload = JSON.parse(atob(token.split('.')[1]));
    const email = payload.email;
    if (!email) {
      setIsLoading(false);
      setShowGenerating(false);
      alert("Impossible de récupérer l'email utilisateur !");
      return;
    }

    const dataToSave = { ...formData, email, today: new Date().toISOString().split("T")[0] };

    const res = await fetch("/api/save-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSave),
    });

    setIsLoading(false);
    setShowGenerating(false);
    if (res.ok) {
      router.push("/training");
    } else {
      alert("Erreur lors de l'enregistrement du profil.");
    }
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Configuration de votre profil</CardTitle>
        <p className="text-gray-600">Aidez-nous à personnaliser votre expérience d'entraînement</p>
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <div className="mb-2">
              <span className="text-sm text-gray-500 font-medium">
                Étape {currentStep} sur {totalSteps}
              </span>
            </div>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Étape 1 - Physiologie */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Physiologie</h3>
              <p className="text-gray-600">Ces données sont essentielles pour personnaliser ton plan</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Âge</Label>
                <Input id="age" type="number" placeholder="25" value={formData.age} onChange={(e) => updateFormData("age", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Sexe</Label>
                <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Taille (cm)</Label>
                <Input id="height" type="number" placeholder="175" value={formData.height} onChange={(e) => updateFormData("height", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input id="weight" type="number" placeholder="70" value={formData.weight} onChange={(e) => updateFormData("weight", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxHeartRate">FC Max (bpm)</Label>
                <Input id="maxHeartRate" type="number" placeholder="190" value={formData.maxHeartRate} onChange={(e) => updateFormData("maxHeartRate", e.target.value)} />
                <p className="text-xs text-gray-500">Si inconnue, laisse vide (calculée automatiquement)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="restingHeartRate">FC Repos (bpm)</Label>
                <Input id="restingHeartRate" type="number" placeholder="60" value={formData.restingHeartRate} onChange={(e) => updateFormData("restingHeartRate", e.target.value)} />
                <p className="text-xs text-gray-500">Mesurée au réveil, au calme</p>
              </div>
            </div>
          </div>
        )}
        {/* Étape 2 - Antécédents sportifs */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Antécédents sportifs</h3>
              <p className="text-gray-600">Comprenons ton niveau et ton expérience</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sportsBackground">Passé sportif et expérience</Label>
              <Textarea
                id="sportsBackground"
                placeholder="Décris ton expérience en course à pied, cyclisme, triathlon, etc."
                value={formData.sportsBackground}
                onChange={(e) => updateFormData("sportsBackground", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weeklyVolume">Volume hebdo actuel (km ou h)</Label>
              <Input id="weeklyVolume" type="text" placeholder="Ex: 30 km ou 4h" value={formData.weeklyVolume} onChange={(e) => updateFormData("weeklyVolume", e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="best10k">Perf 10km (optionnel)</Label>
                <Input id="best10k" type="text" placeholder="Ex: 45:00" value={formData.best10k} onChange={(e) => updateFormData("best10k", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bestHalf">Perf semi (optionnel)</Label>
                <Input id="bestHalf" type="text" placeholder="Ex: 1:40:00" value={formData.bestHalf} onChange={(e) => updateFormData("bestHalf", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bestMarathon">Perf marathon (optionnel)</Label>
                <Input id="bestMarathon" type="text" placeholder="Ex: 3:45:00" value={formData.bestMarathon} onChange={(e) => updateFormData("bestMarathon", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="injuries">Blessures récurrentes (optionnel)</Label>
              <Textarea
                id="injuries"
                placeholder="Décris tes blessures ou limitations physiques, s'il y en a."
                value={formData.injuries}
                onChange={(e) => updateFormData("injuries", e.target.value)}
                rows={2}
              />
            </div>
          </div>
        )}
        {/* Étape 3 - Discipline à entraîner */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Discipline à entraîner</h3>
              <p className="text-gray-600">Choisis la discipline pour laquelle tu veux un plan personnalisé</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discipline">Quelle discipline veux-tu entraîner ?</Label>
              <Select value={formData.discipline} onValueChange={(value) => updateFormData("discipline", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionne une discipline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Running">Running</SelectItem>
                  <SelectItem value="Trail">Trail</SelectItem>
                  <SelectItem value="Cyclisme">Cyclisme</SelectItem>
                  <SelectItem value="Triathlon">Triathlon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        {/* Étape 4 - Running */}
        {currentStep === 4 && formData.discipline === "Running" && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Questions spécifiques Running</h3>
              <p className="text-gray-600">Affinons ton plan pour la course à pied</p>
            </div>
              <div className="space-y-2">
              <Label htmlFor="runningGoal">Quel est ton objectif ?</Label>
              <Select value={formData.runningGoal} onValueChange={value => updateFormData("runningGoal", value)}>
                  <SelectTrigger>
                  <SelectValue placeholder="Choisis un objectif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5k">5 km</SelectItem>
                    <SelectItem value="10k">10 km</SelectItem>
                  <SelectItem value="semi-marathon">Semi-marathon</SelectItem>
                  <SelectItem value="marathon">Marathon</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="runningGoalTime">As-tu un objectif de temps ? (hh:mm:ss)</Label>
              <Input id="runningGoalTime" type="text" placeholder="Ex : 1:45:00" value={formData.runningGoalTime} onChange={e => updateFormData("runningGoalTime", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="runningGoalDate">Date de l'objectif</Label>
              <Input id="runningGoalDate" type="date" value={formData.runningGoalDate} onChange={e => updateFormData("runningGoalDate", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="runningExperience">Quelle est ton expérience en course à pied ?</Label>
              <Select value={formData.runningExperience} onValueChange={value => updateFormData("runningExperience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionne ton niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debutant">Débutant</SelectItem>
                  <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                  <SelectItem value="experimente">Expérimenté</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="runningPace">Quelle est ton allure moyenne sur tes sorties habituelles ? (min/km)</Label>
              <Input id="runningPace" type="text" placeholder="Ex : 5'30/km" value={formData.runningPace} onChange={e => updateFormData("runningPace", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="runningFrequency">Combien de fois cours-tu par semaine ?</Label>
              <Select value={formData.runningFrequency} onValueChange={value => updateFormData("runningFrequency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionne" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6+">6+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
              <Label htmlFor="runningRecentRace">As-tu des références récentes (temps sur course) ?</Label>
              <Input id="runningRecentRace" type="text" placeholder="Ex : 10 km en 45 min" value={formData.runningRecentRace} onChange={e => updateFormData("runningRecentRace", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="runningTrackAccess">As-tu accès à une piste d'athlétisme ?</Label>
              <Select value={formData.runningTrackAccess} onValueChange={value => updateFormData("runningTrackAccess", value)}>
                  <SelectTrigger>
                  <SelectValue placeholder="Sélectionne" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="runningSessionStyle">Préférences de séances</Label>
              <div className="flex gap-2 flex-wrap">
                {['courtes', 'longues', 'variées'].map(style => (
                  <div key={style} className="flex items-center gap-1">
                    <Checkbox
                      id={style}
                      checked={formData.runningSessionStyle?.includes(style) || false}
                      onCheckedChange={checked => {
                        const arr = formData.runningSessionStyle || [];
                        updateFormData(
                          "runningSessionStyle",
                          checked
                            ? [...arr, style]
                            : arr.filter((s: string) => s !== style)
                        );
                      }}
                    />
                    <span className="text-sm">{style.charAt(0).toUpperCase() + style.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Étape 4 - Trail */}
        {currentStep === 4 && formData.discipline === "Trail" && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Questions spécifiques Trail</h3>
              <p className="text-gray-600">Affinons ton plan pour le trail</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailRaceGoal">Quel est ton objectif de course ?</Label>
              <Input id="trailRaceGoal" type="text" placeholder="Ex : 40 km / 2500 D+" value={formData.trailRaceGoal} onChange={e => updateFormData("trailRaceGoal", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailRaceDate">Quelle est la date de ta course ?</Label>
              <Input id="trailRaceDate" type="date" value={formData.trailRaceDate} onChange={e => updateFormData("trailRaceDate", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailExperience">Ton expérience en trail ?</Label>
              <Select value={formData.trailExperience} onValueChange={value => updateFormData("trailExperience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionne ton expérience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aucun">Aucun</SelectItem>
                  <SelectItem value="moins1">Moins d'1 an</SelectItem>
                  <SelectItem value="1-2">1–2 ans</SelectItem>
                  <SelectItem value="3plus">3 ans ou plus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailWeeklyVolume">Volumes hebdo habituels ?</Label>
              <Input id="trailWeeklyVolume" type="text" placeholder="Ex : 40 km / 1200 D+" value={formData.trailWeeklyVolume} onChange={e => updateFormData("trailWeeklyVolume", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailFrequency">Combien de fois cours-tu par semaine ?</Label>
              <Select value={formData.trailFrequency} onValueChange={value => updateFormData("trailFrequency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionne" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6+">6+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailMountainTraining">Peux-tu t'entraîner en montagne ?</Label>
              <Select value={formData.trailMountainTraining} onValueChange={value => updateFormData("trailMountainTraining", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Oui / Non" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailLongDescents">As-tu l'habitude de faire des descentes longues/techniques ?</Label>
              <Select value={formData.trailLongDescents} onValueChange={value => updateFormData("trailLongDescents", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Oui / Non" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailUphillAccess">As-tu accès à des séances en côte (tapis, extérieur) ?</Label>
              <Select value={formData.trailUphillAccess} onValueChange={value => updateFormData("trailUphillAccess", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Oui / Non" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailJointIssues">As-tu des douleurs ou fragilités articulaires ?</Label>
              <Input id="trailJointIssues" type="text" placeholder="Ex : genoux, chevilles..." value={formData.trailJointIssues} onChange={e => updateFormData("trailJointIssues", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailStrengthTraining">Souhaites-tu intégrer du renforcement musculaire ?</Label>
              <Select value={formData.trailStrengthTraining} onValueChange={value => updateFormData("trailStrengthTraining", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Oui / Non" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailGpsWatch">Utilises-tu une montre GPS ?</Label>
              <Select value={formData.trailGpsWatch} onValueChange={value => updateFormData("trailGpsWatch", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Oui / Non" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        {/* Étape 4 - Cyclisme */}
        {currentStep === 4 && formData.discipline === "Cyclisme" && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Questions spécifiques Cyclisme</h3>
              <p className="text-gray-600">Affinons ton plan pour le cyclisme</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cyclingGoal">Quel est ton objectif ?</Label>
              <Input id="cyclingGoal" type="text" placeholder="Ex : cyclosportive 120 km / course FFC / Gravel X" value={formData.cyclingGoal} onChange={e => updateFormData("cyclingGoal", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cyclingGoalDate">Quelle est la date de l'objectif ?</Label>
              <Input id="cyclingGoalDate" type="date" value={formData.cyclingGoalDate} onChange={e => updateFormData("cyclingGoalDate", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cyclingExperience">Depuis combien de temps fais-tu du vélo ?</Label>
              <Select value={formData.cyclingExperience} onValueChange={value => updateFormData("cyclingExperience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionne ton niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debutant">Débutant</SelectItem>
                  <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                  <SelectItem value="experimente">Expérimenté</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cyclingFTP">Ta FTP (si connue) ?</Label>
              <Input id="cyclingFTP" type="number" placeholder="Ex : 250" value={formData.cyclingFTP} onChange={e => updateFormData("cyclingFTP", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cyclingFrequency">Combien de sorties par semaine ?</Label>
              <Select value={formData.cyclingFrequency} onValueChange={value => updateFormData("cyclingFrequency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionne" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6+">6+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cyclingHomeTrainer">Accès à home trainer connecté ?</Label>
              <Select value={formData.cyclingHomeTrainer} onValueChange={value => updateFormData("cyclingHomeTrainer", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Oui / Non" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cyclingPracticeType">Quel est ton type de pratique ?</Label>
              <div className="flex gap-2 flex-wrap">
                {['Route', 'Gravel', 'VTT'].map(type => (
                  <div key={type} className="flex items-center gap-1">
                    <Checkbox
                      id={type}
                      checked={formData.cyclingPracticeType?.includes(type) || false}
                      onCheckedChange={checked => {
                        const arr = formData.cyclingPracticeType || [];
                        updateFormData(
                          "cyclingPracticeType",
                          checked
                            ? [...arr, type]
                            : arr.filter((s: string) => s !== type)
                        );
                      }}
                    />
                    <span className="text-sm">{type}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cyclingLongSessions">Aimes-tu les séances longues ?</Label>
              <Select value={formData.cyclingLongSessions} onValueChange={value => updateFormData("cyclingLongSessions", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Oui / Non" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cyclingPreferences">Préfères-tu : intensité / bosses / endurance ?</Label>
              <div className="flex gap-2 flex-wrap">
                {['intensité', 'bosses', 'endurance'].map(pref => (
                  <div key={pref} className="flex items-center gap-1">
                    <Checkbox
                      id={pref}
                      checked={formData.cyclingPreferences?.includes(pref) || false}
                      onCheckedChange={checked => {
                        const arr = formData.cyclingPreferences || [];
                        updateFormData(
                          "cyclingPreferences",
                          checked
                            ? [...arr, pref]
                            : arr.filter((s: string) => s !== pref)
                        );
                      }}
                    />
                    <span className="text-sm">{pref.charAt(0).toUpperCase() + pref.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cyclingPowerMeter">Utilises-tu capteur de puissance ?</Label>
              <Select value={formData.cyclingPowerMeter} onValueChange={value => updateFormData("cyclingPowerMeter", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Oui / Non" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cyclingTestDone">As-tu déjà fait des tests type PMA, FTP ?</Label>
              <Select value={formData.cyclingTestDone} onValueChange={value => updateFormData("cyclingTestDone", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Oui / Non" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cyclingIssues">Problèmes à éviter (douleurs, pathologies) ?</Label>
              <Input id="cyclingIssues" type="text" placeholder="Ex : genoux, dos..." value={formData.cyclingIssues} onChange={e => updateFormData("cyclingIssues", e.target.value)} />
            </div>
          </div>
        )}
        {/* Étape 4 - Triathlon */}
        {currentStep === 4 && formData.discipline === "Triathlon" && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Questions spécifiques Triathlon</h3>
              <p className="text-gray-600">Affinons ton plan pour le triathlon</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="triathlonFormat">Quel format prépares-tu ?</Label>
              <Select value={formData.triathlonFormat} onValueChange={value => updateFormData("triathlonFormat", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionne le format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="Half">Half Ironman</SelectItem>
                  <SelectItem value="Full">Full Ironman</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="triathlonDate">Quelle est la date de ton triathlon ?</Label>
              <Input id="triathlonDate" type="date" value={formData.triathlonDate} onChange={e => updateFormData("triathlonDate", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="triathlonFrequency">Fréquence d'entraînement par semaine ?</Label>
              <Select value={formData.triathlonFrequency} onValueChange={value => updateFormData("triathlonFrequency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionne" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="7+">7+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="triathlonDistribution">Répartition actuelle (natation / vélo / course) ?</Label>
              <Input id="triathlonDistribution" type="text" placeholder="Ex : 2 / 2 / 2" value={formData.triathlonDistribution} onChange={e => updateFormData("triathlonDistribution", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Niveau en natation ?</Label>
              <Select value={formData.triathlonSwimLevel} onValueChange={value => updateFormData("triathlonSwimLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionne" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debutant">Débutant</SelectItem>
                  <SelectItem value="moyen">Moyen</SelectItem>
                  <SelectItem value="avance">Avancé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Niveau en vélo ?</Label>
              <Select value={formData.triathlonBikeLevel} onValueChange={value => updateFormData("triathlonBikeLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionne" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debutant">Débutant</SelectItem>
                  <SelectItem value="moyen">Moyen</SelectItem>
                  <SelectItem value="avance">Avancé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Niveau en course ?</Label>
              <Select value={formData.triathlonRunLevel} onValueChange={value => updateFormData("triathlonRunLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionne" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debutant">Débutant</SelectItem>
                  <SelectItem value="moyen">Moyen</SelectItem>
                  <SelectItem value="avance">Avancé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="triathlonPriority">Souhaites-tu prioriser un sport ?</Label>
              <Select value={formData.triathlonPriority} onValueChange={value => updateFormData("triathlonPriority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionne" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natation">Natation</SelectItem>
                  <SelectItem value="vélo">Vélo</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="aucun">Aucun</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="triathlonPoolAccess">As-tu accès à une piscine ?</Label>
              <Select value={formData.triathlonPoolAccess} onValueChange={value => updateFormData("triathlonPoolAccess", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Oui / Non" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="triathlonBikeAccess">As-tu accès à un vélo de route ?</Label>
              <Select value={formData.triathlonBikeAccess} onValueChange={value => updateFormData("triathlonBikeAccess", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Oui / Non" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="triathlonHeartRateMonitor">Possèdes-tu un cardiofréquencemètre ?</Label>
              <Select value={formData.triathlonHeartRateMonitor} onValueChange={value => updateFormData("triathlonHeartRateMonitor", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Oui / Non" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="triathlonPowerMeter">As-tu un capteur de puissance ?</Label>
              <Select value={formData.triathlonPowerMeter} onValueChange={value => updateFormData("triathlonPowerMeter", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Oui / Non" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="triathlonAlreadyDone">As-tu déjà participé à un triathlon ?</Label>
              <Select value={formData.triathlonAlreadyDone} onValueChange={value => updateFormData("triathlonAlreadyDone", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Oui / Non" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.triathlonAlreadyDone === "oui" && (
              <div className="space-y-2">
                <Label htmlFor="triathlonAlreadyDoneFormat">Quel format ?</Label>
                <Input id="triathlonAlreadyDoneFormat" type="text" placeholder="Ex : S, M, Half..." value={formData.triathlonAlreadyDoneFormat} onChange={e => updateFormData("triathlonAlreadyDoneFormat", e.target.value)} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="triathlonConstraints">Y a-t-il des contraintes fortes (voyages, famille, santé) ?</Label>
              <Input id="triathlonConstraints" type="text" placeholder="Décris tes contraintes" value={formData.triathlonConstraints} onChange={e => updateFormData("triathlonConstraints", e.target.value)} />
            </div>
          </div>
        )}
        {/* Étape 5 - Consentements */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Autorisations</h3>
              <p className="text-gray-600">Dernière étape pour personnaliser votre expérience</p>
            </div>
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="dataUsage"
                    checked={formData.dataUsageConsent}
                    onCheckedChange={(checked) => updateFormData("dataUsageConsent", checked as boolean)}
                    className="mt-1"
                  />
                  <div className="space-y-2">
                    <Label htmlFor="dataUsage" className="text-sm font-medium leading-5">
                      J'autorise l'utilisation de mes données partagées
                    </Label>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Vos données d'entraînement seront utilisées pour améliorer les recommandations de l'IA et
                      personnaliser votre expérience. Elles restent privées et ne sont jamais partagées avec des tiers.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="notifications"
                    checked={formData.notificationConsent}
                    onCheckedChange={(checked) => updateFormData("notificationConsent", checked as boolean)}
                    className="mt-1"
                  />
                  <div className="space-y-2">
                    <Label htmlFor="notifications" className="text-sm font-medium leading-5">
                      J'accepte de recevoir des notifications pour les courses de préparation
                    </Label>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Recevez des alertes personnalisées quand des courses de préparation intéressantes sont disponibles
                      pour votre objectif. Vous pouvez vous désabonner à tout moment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Button>
          {currentStep < totalSteps ? (
            <Button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !(formData.age && formData.gender && formData.height && formData.weight)) ||
                (currentStep === 2 && !(formData.sportsBackground && formData.weeklyVolume)) ||
                (currentStep === 3 && !formData.discipline) ||
                (currentStep === 4 && formData.discipline === "Running" && (!formData.runningGoal || !formData.runningGoalDate)) ||
                (currentStep === 4 && formData.discipline === "Trail" && (!formData.trailRaceGoal || !formData.trailRaceDate || !formData.trailExperience || !formData.trailWeeklyVolume || !formData.trailFrequency || !formData.trailMountainTraining || !formData.trailLongDescents || !formData.trailUphillAccess || !formData.trailStrengthTraining || !formData.trailGpsWatch)) ||
                (currentStep === 4 && formData.discipline === "Cyclisme" && (!formData.cyclingGoal || !formData.cyclingGoalDate || !formData.cyclingExperience || !formData.cyclingFrequency || !formData.cyclingHomeTrainer || formData.cyclingPracticeType.length === 0 || !formData.cyclingLongSessions || formData.cyclingPreferences.length === 0 || !formData.cyclingPowerMeter || !formData.cyclingTestDone)) ||
                (currentStep === 4 && formData.discipline === "Triathlon" && (!formData.triathlonFormat || !formData.triathlonDate || !formData.triathlonFrequency || !formData.triathlonDistribution || !formData.triathlonSwimLevel || !formData.triathlonBikeLevel || !formData.triathlonRunLevel || !formData.triathlonPriority || !formData.triathlonPoolAccess || !formData.triathlonBikeAccess || !formData.triathlonHeartRateMonitor || !formData.triathlonPowerMeter || !formData.triathlonAlreadyDone || (formData.triathlonAlreadyDone === "oui" && !formData.triathlonAlreadyDoneFormat) || !formData.triathlonConstraints)) ||
                (currentStep === 5 && !formData.dataUsageConsent)
              }
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Configuration...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Terminer
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
      {/* Popup de génération du plan */}
      <Dialog open={showGenerating}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Ton plan est en cours de génération...</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 text-center">
              Cela peut prendre quelques secondes.<br />
              Tu seras redirigé automatiquement vers ton plan d'entraînement.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
} 