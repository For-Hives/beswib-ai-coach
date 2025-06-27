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
import apiClient, { ApiError } from "@/lib/api";

interface SecondaryObjective {
  name: string;
  distance: string;
  elevation: string;
  timeGoal: string;
  date: string;
}

interface OnboardingData {
  // 1. Informations personnelles & physiologiques
  age: string;
  gender: string;
  height: string;
  weight: string;
  maxHeartRate: string;
  restingHeartRate: string;
  sleepHours: string;
  sleepQuality: string;
  dailyStress: string;
  recoveryRoutines: string[];
  // 2. Objectif de course & planification
  goalName: string;
  goalType: string;
  goalDistance: string;
  goalElevation: string;
  goalDate: string;
  goalPerformance: string;
  firstGoal: string;
  specificPrepStarted: string;
  // 3. Historique de performance & tests
  lastTestDate: string;
  vmaOrFtp: string;
  record10k: string;
  maxEffortDuration: string;
  // 4. Nutrition & hydratation
  dietType: string;
  hydrationHabits: string;
  nutritionTolerance: string;
  nutritionBrands: string;
  nutritionGoals: string;
  supplements: string;
  // 5. Vie & emploi du temps
  availableDays: string;
  unpredictableDays: string;
  mentalLoad: string;
  commitments: string;
  // 6. Profil biomécanique & blessures
  injuryHistory: string;
  weakZones: string;
  mobility: string;
  posturalTest: string;
  // 7. Préférences d'entraînement
  sessionTypes: string[];
  favoriteEnvironments: string[];
  groupPreference: string;
  musicPreference: string;
  // 8. Climat & terrain
  usualClimate: string;
  averageAltitude: string;
  mainSurface: string;
  // 9. Motivation & objectifs secondaires
  sportReason: string;
  motivationLevel: string;
  secondaryGoals: string;
  coachExpectations: string;
  // 10. Choix du sport
  discipline: string;
  // 11. Section spécifique par discipline (affichage conditionnel)
  // Running
  runningGoal: string;
  runningGoalTime: string;
  runningGoalDate: string;
  runningExperience: string;
  runningRecentRace: string;
  runningFrequency: string;
  runningPace: string;
  runningTrackAccess: string;
  runningGpsWatch: string;
  runningSessionPref: string[];
  runningInjuries: string;
  runningConstraints: string;
  // Trail
  trailGoal: string;
  trailGoalDate: string;
  trailExperience: string;
  trailWeeklyVolume: string;
  trailFrequency: string;
  trailMountainAccess: string;
  trailUphillAccess: string;
  trailDownhillExperience: string;
  trailStrength: string;
  trailBaroGps: string;
  trailInjuries: string;
  trailConstraints: string;
  // Cyclisme
  cyclingGoal: string;
  cyclingGoalDate: string;
  cyclingExperience: string;
  cyclingFTP: string;
  cyclingTestDone: string;
  cyclingFrequency: string;
  cyclingPracticeType: string[];
  cyclingHomeTrainer: string;
  cyclingPowerMeter: string;
  cyclingPreferences: string[];
  cyclingInjuries: string;
  cyclingConstraints: string;
  // Triathlon
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
  triathlonExperience: string;
  triathlonExperienceFormat: string;
  triathlonInjuries: string;
  triathlonConstraints: string;
  // 12. Accords de partage de données
  dataUsageConsent: boolean;
  notificationConsent: boolean;
  secondaryObjectives: SecondaryObjective[];
  crossTrainingSports: string[];
}

const initialData: OnboardingData = {
  age: "",
  gender: "",
  height: "",
  weight: "",
  maxHeartRate: "",
  restingHeartRate: "",
  sleepHours: "",
  sleepQuality: "",
  dailyStress: "",
  recoveryRoutines: [],
  goalName: "",
  goalType: "",
  goalDistance: "",
  goalElevation: "",
  goalDate: "",
  goalPerformance: "",
  firstGoal: "",
  specificPrepStarted: "",
  lastTestDate: "",
  vmaOrFtp: "",
  record10k: "",
  maxEffortDuration: "",
  dietType: "",
  hydrationHabits: "",
  nutritionTolerance: "",
  nutritionBrands: "",
  nutritionGoals: "",
  supplements: "",
  availableDays: "",
  unpredictableDays: "",
  mentalLoad: "",
  commitments: "",
  injuryHistory: "",
  weakZones: "",
  mobility: "",
  posturalTest: "",
  sessionTypes: [],
  favoriteEnvironments: [],
  groupPreference: "",
  musicPreference: "",
  usualClimate: "",
  averageAltitude: "",
  mainSurface: "",
  sportReason: "",
  motivationLevel: "",
  secondaryGoals: "",
  coachExpectations: "",
  discipline: "",
  runningGoal: "",
  runningGoalTime: "",
  runningGoalDate: "",
  runningExperience: "",
  runningRecentRace: "",
  runningFrequency: "",
  runningPace: "",
  runningTrackAccess: "",
  runningGpsWatch: "",
  runningSessionPref: [],
  runningInjuries: "",
  runningConstraints: "",
  trailGoal: "",
  trailGoalDate: "",
  trailExperience: "",
  trailWeeklyVolume: "",
  trailFrequency: "",
  trailMountainAccess: "",
  trailUphillAccess: "",
  trailDownhillExperience: "",
  trailStrength: "",
  trailBaroGps: "",
  trailInjuries: "",
  trailConstraints: "",
  cyclingGoal: "",
  cyclingGoalDate: "",
  cyclingExperience: "",
  cyclingFTP: "",
  cyclingTestDone: "",
  cyclingFrequency: "",
  cyclingPracticeType: [],
  cyclingHomeTrainer: "",
  cyclingPowerMeter: "",
  cyclingPreferences: [],
  cyclingInjuries: "",
  cyclingConstraints: "",
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
  triathlonExperience: "",
  triathlonExperienceFormat: "",
  triathlonInjuries: "",
  triathlonConstraints: "",
  dataUsageConsent: false,
  notificationConsent: false,
  secondaryObjectives: [],
  crossTrainingSports: [],
};

export function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSecondaryObjectiveModal, setShowSecondaryObjectiveModal] = useState(false);
  const [secondaryObjective, setSecondaryObjective] = useState<SecondaryObjective>({ name: '', distance: '', elevation: '', timeGoal: '', date: '' });
  const router = useRouter();

  // 12 étapes
  const totalSteps = 12;
  const progress = (step / totalSteps) * 100;

  const updateFormData = (field: keyof OnboardingData, value: string | boolean | string[] | SecondaryObjective[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Validation par étape (simplifiée, à affiner selon besoins)
  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.age && formData.gender && formData.height && formData.weight;
      case 2:
        return formData.goalName && formData.goalType && formData.goalDistance && formData.goalDate;
      case 3:
        return formData.lastTestDate && formData.vmaOrFtp;
      case 4:
        return formData.dietType && formData.hydrationHabits;
      case 5:
        return formData.availableDays && formData.mentalLoad;
      case 6:
        return formData.injuryHistory && formData.mobility;
      case 7:
        return formData.sessionTypes.length > 0 && formData.favoriteEnvironments.length > 0 && formData.groupPreference && formData.musicPreference;
      case 8:
        return formData.usualClimate && formData.averageAltitude && formData.mainSurface;
      case 9:
        return formData.sportReason && formData.motivationLevel;
      case 10:
        return formData.discipline;
      case 11:
        if (formData.discipline === "Running") {
          return formData.runningGoal && formData.runningGoalDate;
        } else if (formData.discipline === "Trail") {
          return formData.trailGoal && formData.trailGoalDate;
        } else if (formData.discipline === "Cyclisme") {
          return formData.cyclingGoal && formData.cyclingGoalDate;
        } else if (formData.discipline === "Triathlon") {
          return formData.triathlonFormat && formData.triathlonDate;
        }
        return false;
      case 12:
        return formData.dataUsageConsent;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await apiClient("/api/save-profile", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      // Si l'appel réussit, on affiche la confirmation
      setShowConfirmation(true);
      // On redirige après un court délai
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Erreur lors de la sauvegarde du profil.");
      } else {
        setError("Une erreur inattendue est survenue.");
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
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
                  Étape {step} sur {totalSteps}
                </span>
              </div>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 1. Informations personnelles & physiologiques */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Informations personnelles & physiologiques</h3>
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restingHeartRate">FC Repos (bpm)</Label>
                  <Input id="restingHeartRate" type="number" placeholder="60" value={formData.restingHeartRate} onChange={(e) => updateFormData("restingHeartRate", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sleepHours">Sommeil moyen (h/nuit)</Label>
                  <Input id="sleepHours" type="number" placeholder="7" value={formData.sleepHours} onChange={(e) => updateFormData("sleepHours", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sleepQuality">Qualité du sommeil (1-5)</Label>
                  <Select value={formData.sleepQuality} onValueChange={(value) => updateFormData("sleepQuality", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="1-5" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyStress">Stress quotidien (1-5)</Label>
                  <Select value={formData.dailyStress} onValueChange={(value) => updateFormData("dailyStress", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="1-5" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Routines de récupération</Label>
                  <div className="flex gap-2 flex-wrap">
                    {['Étirements', 'Massage', 'Cryo', 'Auto-massage', 'Compression', 'Autre'].map(opt => (
                      <div key={opt} className="flex items-center gap-1">
                        <Checkbox
                          id={`rec-${opt}`}
                          checked={formData.recoveryRoutines?.includes(opt) || false}
                          onCheckedChange={checked => {
                            const arr = formData.recoveryRoutines || [];
                            updateFormData(
                              "recoveryRoutines",
                              checked
                                ? [...arr, opt]
                                : arr.filter((s: string) => s !== opt)
                            );
                          }}
                        />
                        <span className="text-sm">{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Objectif de course & planification */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Objectif de course & planification</h3>
                <p className="text-gray-600">Définis ton objectif principal</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goalName">Nom de l'objectif</Label>
                <Input id="goalName" type="text" placeholder="Marathon de Paris" value={formData.goalName} onChange={e => updateFormData("goalName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goalType">Type d'objectif</Label>
                <Select value={formData.goalType} onValueChange={value => updateFormData("goalType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionne" />
                  </SelectTrigger>
                  <SelectContent>
                    {['5 km', '10 km', 'Semi', 'Marathon', 'Trail', 'Cyclo', 'Tri', 'Autre'].map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goalDistance">Distance cible (km)</Label>
                  <Input id="goalDistance" type="number" placeholder="42.2" value={formData.goalDistance} onChange={e => updateFormData("goalDistance", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalElevation">Dénivelé positif cible (m)</Label>
                  <Input id="goalElevation" type="number" placeholder="300" value={formData.goalElevation} onChange={e => updateFormData("goalElevation", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goalDate">Date de l'objectif</Label>
                  <Input id="goalDate" type="date" value={formData.goalDate} onChange={e => updateFormData("goalDate", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalPerformance">Objectif de performance (facultatif)</Label>
                  <Input id="goalPerformance" type="text" placeholder="Ex : 3h30 ou top 100" value={formData.goalPerformance} onChange={e => updateFormData("goalPerformance", e.target.value)} />
              </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="firstGoal">Premier objectif ou nouvelle tentative ?</Label>
                  <Select value={formData.firstGoal} onValueChange={value => updateFormData("firstGoal", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Premier">Premier</SelectItem>
                      <SelectItem value="Nouvelle">Nouvelle</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
                <div className="space-y-2">
                  <Label htmlFor="specificPrepStarted">Préparation spécifique déjà commencée ?</Label>
                  <Select value={formData.specificPrepStarted} onValueChange={value => updateFormData("specificPrepStarted", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Oui / Non" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Oui">Oui</SelectItem>
                      <SelectItem value="Non">Non</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={() => setShowSecondaryObjectiveModal(true)} variant="outline">Ajouter un objectif secondaire</Button>
                <div className="mt-4 space-y-2">
                  {formData.secondaryObjectives.length > 0 && <div className="font-semibold">Objectifs secondaires ajoutés :</div>}
                  {formData.secondaryObjectives.map((obj, idx) => (
                    <div key={idx} className="p-2 border rounded bg-green-50">
                      <div><b>Nom :</b> {obj.name}</div>
                      <div><b>Distance :</b> {obj.distance} km</div>
                      <div><b>Dénivelé :</b> {obj.elevation} m</div>
                      <div><b>Objectif temps :</b> {obj.timeGoal}</div>
                      <div><b>Date :</b> {obj.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Historique de performance & tests */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Historique de performance & tests</h3>
                <p className="text-gray-600">Renseigne tes tests et records récents</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="lastTestDate">Date du dernier test VMA/FTP</Label>
                  <Input id="lastTestDate" type="date" value={formData.lastTestDate} onChange={e => updateFormData("lastTestDate", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vmaOrFtp">Résultat test VMA (km/h) ou FTP (W)</Label>
                  <Input id="vmaOrFtp" type="number" placeholder="Ex : 16 ou 250" value={formData.vmaOrFtp} onChange={e => updateFormData("vmaOrFtp", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="record10k">Record personnel 10 km (hh:mm:ss)</Label>
                  <Input id="record10k" type="text" placeholder="Ex : 45:00" value={formData.record10k} onChange={e => updateFormData("record10k", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxEffortDuration">Durée max d'effort continu (min)</Label>
                  <Input id="maxEffortDuration" type="number" placeholder="120" value={formData.maxEffortDuration} onChange={e => updateFormData("maxEffortDuration", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* 4. Nutrition & hydratation */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Nutrition & hydratation</h3>
                <p className="text-gray-600">Décris tes habitudes alimentaires et hydriques</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dietType">Type d'alimentation</Label>
                  <Select value={formData.dietType} onValueChange={value => updateFormData("dietType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Omnivore">Omnivore</SelectItem>
                      <SelectItem value="Végé">Végétarien</SelectItem>
                      <SelectItem value="Végan">Végan</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hydrationHabits">Quantité d'eau/jour (L)</Label>
                  <Input id="hydrationHabits" type="number" placeholder="2" value={formData.hydrationHabits} onChange={e => updateFormData("hydrationHabits", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nutritionTolerance">Tolérance gels/barres énergétiques ?</Label>
                <Select value={formData.nutritionTolerance} onValueChange={value => updateFormData("nutritionTolerance", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Oui / Non" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oui">Oui</SelectItem>
                    <SelectItem value="Non">Non</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.nutritionTolerance === "Oui" && (
                <div className="space-y-2">
                  <Label htmlFor="nutritionBrands">Marques préférées</Label>
                  <Input id="nutritionBrands" type="text" placeholder="Overstim, Maurten..." value={formData.nutritionBrands} onChange={e => updateFormData("nutritionBrands", e.target.value)} />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="nutritionGoals">Objectifs nutritionnels</Label>
                <Input id="nutritionGoals" type="text" placeholder="Perte de poids, prise de masse..." value={formData.nutritionGoals} onChange={e => updateFormData("nutritionGoals", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplements">Suppléments utilisés (facultatif)</Label>
                <Input id="supplements" type="text" placeholder="Magnésium, BCAA..." value={formData.supplements} onChange={e => updateFormData("supplements", e.target.value)} />
              </div>
            </div>
          )}

          {/* 5. Vie & emploi du temps */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Vie & emploi du temps</h3>
                <p className="text-gray-600">Précise tes disponibilités et contraintes</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableDays">Jours et créneaux disponibles</Label>
                <Textarea id="availableDays" value={formData.availableDays} onChange={e => updateFormData("availableDays", e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unpredictableDays">Jours imprévisibles (voyages, réunions...)</Label>
                <Textarea id="unpredictableDays" value={formData.unpredictableDays} onChange={e => updateFormData("unpredictableDays", e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentalLoad">Charge mentale / pro</Label>
                <Select value={formData.mentalLoad} onValueChange={value => updateFormData("mentalLoad", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Faible / Modérée / Élevée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Faible">Faible</SelectItem>
                    <SelectItem value="Modérée">Modérée</SelectItem>
                    <SelectItem value="Élevée">Élevée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commitments">Autres engagements (famille, études...)</Label>
                <Textarea id="commitments" value={formData.commitments} onChange={e => updateFormData("commitments", e.target.value)} rows={2} />
              </div>
            </div>
          )}

          {/* 6. Profil biomécanique & blessures */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Profil biomécanique & blessures</h3>
                <p className="text-gray-600">Pour prévenir les blessures et adapter le plan</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="injuryHistory">Antécédents de blessures</Label>
                <Textarea id="injuryHistory" value={formData.injuryHistory} onChange={e => updateFormData("injuryHistory", e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weakZones">Zones de fragilité musculaire/articulaire</Label>
                <Input id="weakZones" type="text" value={formData.weakZones} onChange={e => updateFormData("weakZones", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobility">Mobilité / souplesse générale (1-5)</Label>
                <Select value={formData.mobility} onValueChange={value => updateFormData("mobility", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="1-5" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="posturalTest">Tests posturaux / podométrie (facultatif)</Label>
                <Input id="posturalTest" type="text" value={formData.posturalTest} onChange={e => updateFormData("posturalTest", e.target.value)} />
              </div>
            </div>
          )}

          {/* 7. Préférences d'entraînement */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Préférences d'entraînement</h3>
                <p className="text-gray-600">Pour adapter le style de tes séances</p>
              </div>
              <div className="space-y-2">
                <Label>Type de séances préférées</Label>
                <div className="flex gap-2 flex-wrap">
                  {['Fractionné', 'Endurance', 'Côtes', 'Renfo'].map(opt => (
                    <div key={opt} className="flex items-center gap-1">
                      <Checkbox
                        id={`pref-${opt}`}
                        checked={formData.sessionTypes?.includes(opt) || false}
                        onCheckedChange={checked => {
                          const arr = formData.sessionTypes || [];
                          updateFormData(
                            "sessionTypes",
                            checked
                              ? [...arr, opt]
                              : arr.filter((s: string) => s !== opt)
                          );
                        }}
                      />
                      <span className="text-sm">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Environnement favori</Label>
                <div className="flex gap-2 flex-wrap">
                  {['Route', 'Trail', 'Home trainer'].map(opt => (
                    <div key={opt} className="flex items-center gap-1">
                      <Checkbox
                        id={`env-${opt}`}
                        checked={formData.favoriteEnvironments?.includes(opt) || false}
                        onCheckedChange={checked => {
                          const arr = formData.favoriteEnvironments || [];
                          updateFormData(
                            "favoriteEnvironments",
                            checked
                              ? [...arr, opt]
                              : arr.filter((s: string) => s !== opt)
                          );
                        }}
                      />
                      <span className="text-sm">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupPreference">Préférence : seul ou en groupe ?</Label>
                <Select value={formData.groupPreference} onValueChange={value => updateFormData("groupPreference", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionne" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Seul">Seul</SelectItem>
                    <SelectItem value="Groupe">Groupe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="musicPreference">Musique ou silence ?</Label>
                <Select value={formData.musicPreference} onValueChange={value => updateFormData("musicPreference", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionne" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Musique">Musique</SelectItem>
                    <SelectItem value="Silence">Silence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* 8. Climat & terrain */}
          {step === 8 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Climat & terrain</h3>
                <p className="text-gray-600">Pour adapter le plan à ton environnement</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usualClimate">Conditions climatiques habituelles</Label>
                <Select value={formData.usualClimate} onValueChange={value => updateFormData("usualClimate", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionne" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tempéré">Tempéré</SelectItem>
                    <SelectItem value="Chaud">Chaud</SelectItem>
                    <SelectItem value="Humide">Humide</SelectItem>
                    <SelectItem value="Montagneux">Montagneux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="averageAltitude">Altitude moyenne d'entraînement (m)</Label>
                <Input id="averageAltitude" type="number" placeholder="200" value={formData.averageAltitude} onChange={e => updateFormData("averageAltitude", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainSurface">Surface dominante</Label>
                <Select value={formData.mainSurface} onValueChange={value => updateFormData("mainSurface", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionne" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asphalte">Asphalte</SelectItem>
                    <SelectItem value="Trail">Trail</SelectItem>
                    <SelectItem value="Mixte">Mixte</SelectItem>
                    <SelectItem value="Piste">Piste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* 9. Motivation & objectifs secondaires */}
          {step === 9 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Motivation & objectifs secondaires</h3>
                <p className="text-gray-600">Pour mieux comprendre tes attentes</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sportReason">Pourquoi pratiques-tu ce sport ?</Label>
                <Textarea id="sportReason" value={formData.sportReason} onChange={e => updateFormData("sportReason", e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivationLevel">Niveau de motivation (1-5)</Label>
                <Select value={formData.motivationLevel} onValueChange={value => updateFormData("motivationLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="1-5" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryGoals">Objectifs secondaires</Label>
                <Input id="secondaryGoals" type="text" value={formData.secondaryGoals} onChange={e => updateFormData("secondaryGoals", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coachExpectations">Attentes vis-à-vis du coach IA</Label>
                <Textarea id="coachExpectations" value={formData.coachExpectations} onChange={e => updateFormData("coachExpectations", e.target.value)} rows={2} />
              </div>
            </div>
          )}

          {/* 10. Choix du sport */}
          {step === 10 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Choix du sport</h3>
                <p className="text-gray-600">Quelle discipline veux-tu entraîner ?</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discipline">Discipline</Label>
                <Select value={formData.discipline} onValueChange={value => updateFormData("discipline", value)}>
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

          {/* 11. Section spécifique par discipline */}
          {step === 11 && (
            <div className="space-y-4">
              {formData.discipline === "Running" && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">Questions spécifiques Running</h3>
                    <p className="text-gray-600">Affinons ton plan pour la course à pied</p>
                  </div>
                    <div className="space-y-2">
                        <Label htmlFor="runningGoal">Objectif de distance</Label>
                    <Select value={formData.runningGoal} onValueChange={value => updateFormData("runningGoal", value)}>
                        <SelectTrigger>
                        <SelectValue placeholder="Choisis un objectif" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5 km">5 km</SelectItem>
                            <SelectItem value="10 km">10 km</SelectItem>
                            <SelectItem value="Semi-marathon">Semi-marathon</SelectItem>
                            <SelectItem value="Marathon">Marathon</SelectItem>
                            <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="runningGoalTime">Objectif de temps (hh:mm:ss)</Label>
                    <Input id="runningGoalTime" type="text" placeholder="Ex : 1:45:00" value={formData.runningGoalTime} onChange={e => updateFormData("runningGoalTime", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="runningGoalDate">Date de l'objectif</Label>
                    <Input id="runningGoalDate" type="date" value={formData.runningGoalDate} onChange={e => updateFormData("runningGoalDate", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="runningExperience">Expérience en course sur route</Label>
                    <Select value={formData.runningExperience} onValueChange={value => updateFormData("runningExperience", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionne ton niveau" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Débutant">Débutant</SelectItem>
                            <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                            <SelectItem value="Confirmé">Confirmé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="runningRecentRace">Meilleur chrono récent</Label>
                        <Input id="runningRecentRace" type="text" placeholder="10 km en 45 min" value={formData.runningRecentRace} onChange={e => updateFormData("runningRecentRace", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="runningFrequency">Séances de course/semaine</Label>
                    <Select value={formData.runningFrequency} onValueChange={value => updateFormData("runningFrequency", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionne" />
                      </SelectTrigger>
                      <SelectContent>
                            {["1","2","3","4","5","6+"].map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="runningPace">Allure moyenne habituelle (min/km)</Label>
                        <Input id="runningPace" type="text" placeholder="5:30" value={formData.runningPace} onChange={e => updateFormData("runningPace", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="runningTrackAccess">Accès à une piste d'athlétisme ?</Label>
                    <Select value={formData.runningTrackAccess} onValueChange={value => updateFormData("runningTrackAccess", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Oui / Non" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="runningGpsWatch">Utilises-tu une montre GPS ?</Label>
                        <Select value={formData.runningGpsWatch} onValueChange={value => updateFormData("runningGpsWatch", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Oui / Non" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Préférence de séances</Label>
                    <div className="flex gap-2 flex-wrap">
                          {['Courtes', 'Longues', 'Variées'].map(opt => (
                            <div key={opt} className="flex items-center gap-1">
                          <Checkbox
                                id={`run-pref-${opt}`}
                                checked={formData.runningSessionPref?.includes(opt) || false}
                            onCheckedChange={checked => {
                                  const arr = formData.runningSessionPref || [];
                              updateFormData(
                                    "runningSessionPref",
                                checked
                                      ? [...arr, opt]
                                      : arr.filter((s: string) => s !== opt)
                              );
                            }}
                          />
                              <span className="text-sm">{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                      <div className="space-y-2">
                        <Label htmlFor="runningInjuries">Blessures ou douleurs récurrentes</Label>
                      <Input id="runningInjuries" type="text" value={formData.runningInjuries} onChange={e => updateFormData("runningInjuries", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="runningConstraints">Contraintes (emploi du temps, déplacements...)</Label>
                      <Input id="runningConstraints" type="text" value={formData.runningConstraints} onChange={e => updateFormData("runningConstraints", e.target.value)} />
                    </div>
                </div>
              )}
              {formData.discipline === "Trail" && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">Questions spécifiques Trail</h3>
                    <p className="text-gray-600">Affinons ton plan pour le trail</p>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="trailGoal">Objectif distance/dénivelé</Label>
                        <Input id="trailGoal" type="text" placeholder="40 km / 2500 m D+" value={formData.trailGoal} onChange={e => updateFormData("trailGoal", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="trailGoalDate">Date de la course</Label>
                        <Input id="trailGoalDate" type="date" value={formData.trailGoalDate} onChange={e => updateFormData("trailGoalDate", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="trailExperience">Expérience trail</Label>
                    <Select value={formData.trailExperience} onValueChange={value => updateFormData("trailExperience", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionne ton expérience" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Aucun">Aucun</SelectItem>
                            <SelectItem value="< 1 an">Moins d'1 an</SelectItem>
                            <SelectItem value="1–2 ans">1–2 ans</SelectItem>
                            <SelectItem value="3+ ans">3 ans ou plus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="trailWeeklyVolume">Volume hebdo actuel (km + D+)</Label>
                        <Input id="trailWeeklyVolume" type="text" placeholder="40 km / 1200 m D+" value={formData.trailWeeklyVolume} onChange={e => updateFormData("trailWeeklyVolume", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="trailFrequency">Séances trail/semaine</Label>
                    <Select value={formData.trailFrequency} onValueChange={value => updateFormData("trailFrequency", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionne" />
                      </SelectTrigger>
                      <SelectContent>
                            {["1","2","3","4","5","6+"].map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="trailMountainAccess">Peux-tu t'entraîner en montagne ?</Label>
                        <Select value={formData.trailMountainAccess} onValueChange={value => updateFormData("trailMountainAccess", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Oui / Non" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="trailUphillAccess">Accès à des séances en côte ?</Label>
                        <Select value={formData.trailUphillAccess} onValueChange={value => updateFormData("trailUphillAccess", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Oui / Non" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="trailDownhillExperience">Habitude des descentes longues/techniques ?</Label>
                        <Select value={formData.trailDownhillExperience} onValueChange={value => updateFormData("trailDownhillExperience", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Oui / Non" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="trailStrength">Renforcement musculaire spécifique trail ?</Label>
                        <Select value={formData.trailStrength} onValueChange={value => updateFormData("trailStrength", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Oui / Non" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="trailBaroGps">Montre GPS barométrique ?</Label>
                        <Select value={formData.trailBaroGps} onValueChange={value => updateFormData("trailBaroGps", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Oui / Non" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                      <div className="space-y-2">
                        <Label htmlFor="trailInjuries">Douleurs ou fragilités articulaires</Label>
                        <Input id="trailInjuries" type="text" value={formData.trailInjuries} onChange={e => updateFormData("trailInjuries", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trailConstraints">Contraintes particulières</Label>
                        <Input id="trailConstraints" type="text" value={formData.trailConstraints} onChange={e => updateFormData("trailConstraints", e.target.value)} />
                      </div>
                </div>
              )}
              {formData.discipline === "Cyclisme" && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">Questions spécifiques Cyclisme</h3>
                    <p className="text-gray-600">Affinons ton plan pour le cyclisme</p>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="cyclingGoal">Objectif principal</Label>
                        <Input id="cyclingGoal" type="text" placeholder="Cyclosportive 120 km..." value={formData.cyclingGoal} onChange={e => updateFormData("cyclingGoal", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="cyclingGoalDate">Date de l'objectif</Label>
                    <Input id="cyclingGoalDate" type="date" value={formData.cyclingGoalDate} onChange={e => updateFormData("cyclingGoalDate", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="cyclingExperience">Expérience vélo</Label>
                    <Select value={formData.cyclingExperience} onValueChange={value => updateFormData("cyclingExperience", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionne ton niveau" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Débutant">Débutant</SelectItem>
                            <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                            <SelectItem value="Confirmé">Confirmé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="cyclingFTP">FTP (facultatif)</Label>
                        <Input id="cyclingFTP" type="number" placeholder="250" value={formData.cyclingFTP} onChange={e => updateFormData("cyclingFTP", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="cyclingTestDone">Test FTP ou PMA déjà fait ?</Label>
                        <Select value={formData.cyclingTestDone} onValueChange={value => updateFormData("cyclingTestDone", value)}>
                      <SelectTrigger>
                            <SelectValue placeholder="Oui / Non" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="cyclingFrequency">Sorties vélo/semaine</Label>
                        <Select value={formData.cyclingFrequency} onValueChange={value => updateFormData("cyclingFrequency", value)}>
                      <SelectTrigger>
                            <SelectValue placeholder="Sélectionne" />
                      </SelectTrigger>
                      <SelectContent>
                            {["1","2","3","4","5","6+"].map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label>Type de pratique</Label>
                    <div className="flex gap-2 flex-wrap">
                          {['Route', 'Gravel', 'VTT'].map(opt => (
                            <div key={opt} className="flex items-center gap-1">
                          <Checkbox
                                id={`cyc-type-${opt}`}
                                checked={formData.cyclingPracticeType?.includes(opt) || false}
                            onCheckedChange={checked => {
                              const arr = formData.cyclingPracticeType || [];
                              updateFormData(
                                "cyclingPracticeType",
                                checked
                                      ? [...arr, opt]
                                      : arr.filter((s: string) => s !== opt)
                              );
                            }}
                          />
                              <span className="text-sm">{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="cyclingHomeTrainer">Accès à un home trainer connecté ?</Label>
                        <Select value={formData.cyclingHomeTrainer} onValueChange={value => updateFormData("cyclingHomeTrainer", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Oui / Non" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="cyclingPowerMeter">Capteur de puissance ?</Label>
                        <Select value={formData.cyclingPowerMeter} onValueChange={value => updateFormData("cyclingPowerMeter", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Oui / Non" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Préférences</Label>
                    <div className="flex gap-2 flex-wrap">
                          {['Longues', 'Intensités', 'Montées'].map(opt => (
                            <div key={opt} className="flex items-center gap-1">
                          <Checkbox
                                id={`cyc-pref-${opt}`}
                                checked={formData.cyclingPreferences?.includes(opt) || false}
                            onCheckedChange={checked => {
                              const arr = formData.cyclingPreferences || [];
                              updateFormData(
                                "cyclingPreferences",
                                checked
                                      ? [...arr, opt]
                                      : arr.filter((s: string) => s !== opt)
                              );
                            }}
                          />
                              <span className="text-sm">{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="cyclingInjuries">Douleurs ou pathologies liées au vélo</Label>
                        <Input id="cyclingInjuries" type="text" value={formData.cyclingInjuries} onChange={e => updateFormData("cyclingInjuries", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="cyclingConstraints">Contraintes logistiques ou de temps</Label>
                        <Input id="cyclingConstraints" type="text" value={formData.cyclingConstraints} onChange={e => updateFormData("cyclingConstraints", e.target.value)} />
                  </div>
                </div>
              )}
              {formData.discipline === "Triathlon" && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">Questions spécifiques Triathlon</h3>
                    <p className="text-gray-600">Affinons ton plan pour le triathlon</p>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="triathlonFormat">Format préparé</Label>
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
                        <Label htmlFor="triathlonDate">Date du triathlon</Label>
                    <Input id="triathlonDate" type="date" value={formData.triathlonDate} onChange={e => updateFormData("triathlonDate", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="triathlonFrequency">Séances/semaine (total disciplines)</Label>
                    <Select value={formData.triathlonFrequency} onValueChange={value => updateFormData("triathlonFrequency", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionne" />
                      </SelectTrigger>
                      <SelectContent>
                            {["3","4","5","6","7+"].map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="triathlonDistribution">Répartition Nage/Vélo/Course</Label>
                        <Input id="triathlonDistribution" type="text" placeholder="2 / 2 / 2" value={formData.triathlonDistribution} onChange={e => updateFormData("triathlonDistribution", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="triathlonSwimLevel">Niveau natation</Label>
                    <Select value={formData.triathlonSwimLevel} onValueChange={value => updateFormData("triathlonSwimLevel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionne" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Débutant">Débutant</SelectItem>
                            <SelectItem value="Moyen">Moyen</SelectItem>
                            <SelectItem value="Confirmé">Confirmé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="triathlonBikeLevel">Niveau vélo</Label>
                    <Select value={formData.triathlonBikeLevel} onValueChange={value => updateFormData("triathlonBikeLevel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionne" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Débutant">Débutant</SelectItem>
                            <SelectItem value="Moyen">Moyen</SelectItem>
                            <SelectItem value="Confirmé">Confirmé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="triathlonRunLevel">Niveau course à pied</Label>
                    <Select value={formData.triathlonRunLevel} onValueChange={value => updateFormData("triathlonRunLevel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionne" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Débutant">Débutant</SelectItem>
                            <SelectItem value="Moyen">Moyen</SelectItem>
                            <SelectItem value="Confirmé">Confirmé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="triathlonPriority">Discipline à prioriser ?</Label>
                    <Select value={formData.triathlonPriority} onValueChange={value => updateFormData("triathlonPriority", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionne" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Natation">Natation</SelectItem>
                            <SelectItem value="Vélo">Vélo</SelectItem>
                            <SelectItem value="Course">Course</SelectItem>
                            <SelectItem value="Aucun">Aucun</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="triathlonPoolAccess">Accès à une piscine ?</Label>
                    <Select value={formData.triathlonPoolAccess} onValueChange={value => updateFormData("triathlonPoolAccess", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Oui / Non" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="triathlonBikeAccess">Accès à un vélo de route/home trainer ?</Label>
                    <Select value={formData.triathlonBikeAccess} onValueChange={value => updateFormData("triathlonBikeAccess", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Oui / Non" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="triathlonHeartRateMonitor">Cardiofréquencemètre ?</Label>
                    <Select value={formData.triathlonHeartRateMonitor} onValueChange={value => updateFormData("triathlonHeartRateMonitor", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Oui / Non" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="triathlonPowerMeter">Capteur de puissance vélo ?</Label>
                    <Select value={formData.triathlonPowerMeter} onValueChange={value => updateFormData("triathlonPowerMeter", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Oui / Non" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="triathlonExperience">Déjà fait un triathlon ?</Label>
                        <Select value={formData.triathlonExperience} onValueChange={value => updateFormData("triathlonExperience", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Oui / Non" />
                      </SelectTrigger>
                      <SelectContent>
                            <SelectItem value="Oui">Oui</SelectItem>
                            <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                      {formData.triathlonExperience === "Oui" && (
                    <div className="space-y-2">
                          <Label htmlFor="triathlonExperienceFormat">Quel format ?</Label>
                          <Input id="triathlonExperienceFormat" type="text" placeholder="Ex : S, M, Half..." value={formData.triathlonExperienceFormat} onChange={e => updateFormData("triathlonExperienceFormat", e.target.value)} />
                    </div>
                  )}
                  <div className="space-y-2">
                        <Label htmlFor="triathlonInjuries">Douleurs ou contraintes médicales</Label>
                        <Input id="triathlonInjuries" type="text" value={formData.triathlonInjuries} onChange={e => updateFormData("triathlonInjuries", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="triathlonConstraints">Contraintes (travail, famille, voyages...)</Label>
                    <Input id="triathlonConstraints" type="text" value={formData.triathlonConstraints} onChange={e => updateFormData("triathlonConstraints", e.target.value)} />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Entraînement croisé ?</Label>
                <div className="flex gap-2 flex-wrap">
                  {['Trail', 'Running', 'Cyclisme', 'Natation'].map(opt => (
                    <div key={opt} className="flex items-center gap-1">
                    <Checkbox
                        id={`cross-${opt}`}
                        checked={formData.crossTrainingSports?.includes(opt) || false}
                        onCheckedChange={checked => {
                          const arr = formData.crossTrainingSports || [];
                          updateFormData(
                            "crossTrainingSports",
                            checked
                              ? [...arr, opt]
                              : arr.filter((s: string) => s !== opt)
                          );
                        }}
                      />
                      <span className="text-sm">{opt}</span>
                    </div>
                  ))}
                  </div>
                <p className="text-gray-500 text-xs">Sélectionne les sports que tu aimerais intégrer en complément dans ton plan (entraînement croisé).</p>
                </div>
            </div>
          )}

          {/* 12. Accords de partage de données */}
          {step === 12 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Accords de partage de données</h3>
                <p className="text-gray-600">Merci de valider les consentements nécessaires</p>
                  </div>
              <div className="flex items-center gap-2">
                <Checkbox id="dataUsageConsent" checked={formData.dataUsageConsent} onCheckedChange={checked => updateFormData("dataUsageConsent", !!checked)} />
                <Label htmlFor="dataUsageConsent">J'accepte l'utilisation de mes données pour la personnalisation du plan</Label>
                </div>
              <div className="flex items-center gap-2">
                <Checkbox id="notificationConsent" checked={formData.notificationConsent} onCheckedChange={checked => updateFormData("notificationConsent", !!checked)} />
                <Label htmlFor="notificationConsent">Je souhaite recevoir des notifications et conseils personnalisés</Label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={prevStep} disabled={step === 1} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
            {step < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid() || isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
              >
                {isSubmitting ? (
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
      </Card>

      {/* Modale d'ajout d'objectif secondaire */}
      <Dialog open={showSecondaryObjectiveModal} onOpenChange={setShowSecondaryObjectiveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un objectif secondaire</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Nom</Label>
            <Input value={secondaryObjective.name} onChange={e => setSecondaryObjective({ ...secondaryObjective, name: e.target.value })} />
            <Label>Distance (km)</Label>
            <Input type="number" value={secondaryObjective.distance} onChange={e => setSecondaryObjective({ ...secondaryObjective, distance: e.target.value })} />
            <Label>Dénivelé (m)</Label>
            <Input type="number" value={secondaryObjective.elevation} onChange={e => setSecondaryObjective({ ...secondaryObjective, elevation: e.target.value })} />
            <Label>Objectif temps</Label>
            <Input value={secondaryObjective.timeGoal} onChange={e => setSecondaryObjective({ ...secondaryObjective, timeGoal: e.target.value })} />
            <Label>Date</Label>
            <Input type="date" value={secondaryObjective.date} onChange={e => setSecondaryObjective({ ...secondaryObjective, date: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowSecondaryObjectiveModal(false)}>Annuler</Button>
            <Button onClick={() => {
              updateFormData('secondaryObjectives', [...formData.secondaryObjectives, secondaryObjective]);
              setSecondaryObjective({ name: '', distance: '', elevation: '', timeGoal: '', date: '' });
              setShowSecondaryObjectiveModal(false);
            }} disabled={!secondaryObjective.name || !secondaryObjective.distance || !secondaryObjective.date}>Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Modale de confirmation/génération */}
      <Dialog open={showConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Profil enregistré !</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p>Votre profil a été sauvegardé avec succès.</p>
            <p className="text-sm text-gray-500">Vous allez être redirigé vers votre tableau de bord...</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}