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

interface OnboardingData {
  gender: string
  age: string
  maxHeartRate: string
  restingHeartRate: string
  trainingFrequency: string
  sportsBackground: string
  targetRaces: string
  targetDistance: string
  targetMonth: string
  dataUsageConsent: boolean
  notificationConsent: boolean
}

const initialData: OnboardingData = {
  gender: "",
  age: "",
  maxHeartRate: "",
  restingHeartRate: "",
  trainingFrequency: "",
  sportsBackground: "",
  targetRaces: "",
  targetDistance: "",
  targetMonth: "",
  dataUsageConsent: false,
  notificationConsent: false,
}

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingData>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const updateFormData = (field: keyof OnboardingData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
    // For demo: ask for email (replace with your auth logic)
    const email = prompt("Entrez votre email pour enregistrer votre profil :");
    if (!email) {
      setIsLoading(false);
      alert("Email requis !");
      return;
    }
    const dataToSave = { ...formData, email };

    const res = await fetch("/api/save-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSave),
    });

    setIsLoading(false);
    if (res.ok) {
      router.push("/");
    } else {
      alert("Erreur lors de l'enregistrement du profil.");
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.gender && formData.age && formData.maxHeartRate && formData.restingHeartRate
      case 2:
        return formData.trainingFrequency && formData.sportsBackground
      case 3:
        return (formData.targetRaces || formData.targetDistance) && formData.targetMonth
      case 4:
        return formData.dataUsageConsent
      default:
        return false
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
            <span>Étape {currentStep} sur {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Étape 1 - Informations personnelles */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Informations personnelles</h3>
              <p className="text-gray-600">Ces données nous aident à calculer vos zones d'entraînement</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxHeartRate">FC Max (bpm)</Label>
                <Input
                  id="maxHeartRate"
                  type="number"
                  placeholder="190"
                  value={formData.maxHeartRate}
                  onChange={(e) => updateFormData("maxHeartRate", e.target.value)}
                />
                <p className="text-xs text-gray-500">Si inconnue, laissez vide (calculée automatiquement)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="restingHeartRate">FC Repos (bpm)</Label>
                <Input
                  id="restingHeartRate"
                  type="number"
                  placeholder="60"
                  value={formData.restingHeartRate}
                  onChange={(e) => updateFormData("restingHeartRate", e.target.value)}
                />
                <p className="text-xs text-gray-500">Mesurée au réveil, au calme</p>
              </div>
            </div>
          </div>
        )}
        {/* Étape 2 - Entraînement */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Votre pratique sportive</h3>
              <p className="text-gray-600">Comprenons votre niveau et disponibilité</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingFrequency">Fréquence d'entraînement souhaitée</Label>
              <Select
                value={formData.trainingFrequency}
                onValueChange={(value) => updateFormData("trainingFrequency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Combien de fois par semaine ?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2">1-2 fois par semaine</SelectItem>
                  <SelectItem value="3">3 fois par semaine</SelectItem>
                  <SelectItem value="4">4 fois par semaine</SelectItem>
                  <SelectItem value="5">5 fois par semaine</SelectItem>
                  <SelectItem value="6+">6+ fois par semaine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sportsBackground">Passé sportif et expérience</Label>
              <Textarea
                id="sportsBackground"
                placeholder="Décrivez votre expérience en course à pied et autres sports pratiqués. Ex: 'Je cours depuis 2 ans, j'ai fait quelques 10km. J'ai pratiqué le football pendant 10 ans.'"
                value={formData.sportsBackground}
                onChange={(e) => updateFormData("sportsBackground", e.target.value)}
                rows={4}
              />
              <p className="text-xs text-gray-500">Ces informations nous aident à adapter votre programme</p>
            </div>
          </div>
        )}
        {/* Étape 3 - Objectifs */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Vos objectifs</h3>
              <p className="text-gray-600">Définissons ensemble votre plan d'entraînement</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetRaces">Courses objectif de l'année (optionnel)</Label>
              <Input
                id="targetRaces"
                placeholder="Ex: Marathon de Paris, Semi de Boulogne..."
                value={formData.targetRaces}
                onChange={(e) => updateFormData("targetRaces", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetDistance">Distance objectif</Label>
                <Select
                  value={formData.targetDistance}
                  onValueChange={(value) => updateFormData("targetDistance", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez une distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5k">5 km</SelectItem>
                    <SelectItem value="10k">10 km</SelectItem>
                    <SelectItem value="semi">Semi-marathon (21 km)</SelectItem>
                    <SelectItem value="marathon">Marathon (42 km)</SelectItem>
                    <SelectItem value="trail">Trail</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetMonth">Mois objectif</Label>
                <Select value={formData.targetMonth} onValueChange={(value) => updateFormData("targetMonth", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Quand ?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="january">Janvier</SelectItem>
                    <SelectItem value="february">Février</SelectItem>
                    <SelectItem value="march">Mars</SelectItem>
                    <SelectItem value="april">Avril</SelectItem>
                    <SelectItem value="may">Mai</SelectItem>
                    <SelectItem value="june">Juin</SelectItem>
                    <SelectItem value="july">Juillet</SelectItem>
                    <SelectItem value="august">Août</SelectItem>
                    <SelectItem value="september">Septembre</SelectItem>
                    <SelectItem value="october">Octobre</SelectItem>
                    <SelectItem value="november">Novembre</SelectItem>
                    <SelectItem value="december">Décembre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
        {/* Étape 4 - Consentements */}
        {currentStep === 4 && (
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
              disabled={!isStepValid()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || isLoading}
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
    </Card>
  )
} 