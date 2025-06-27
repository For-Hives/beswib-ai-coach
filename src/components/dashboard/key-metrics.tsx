"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin, Target, Trophy, TrendingUp } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

export default function KeyMetrics() {
  const { metrics, isLoading, error } = useDashboardMetrics();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Métriques clés</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chargement des métriques...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return null; // Ou un état vide
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métriques clés</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Km totaux */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Km totaux</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">{metrics.kmThisMonth}</span>
          </div>
          <p className="text-xs text-gray-600">Ce mois-ci</p>
        </div>

        {/* Séances réalisées */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Séances réalisées</span>
            </div>
            <span className="text-2xl font-bold text-green-600">{metrics.nSessions}/{metrics.nSessionsPlanned}</span>
          </div>
          <Progress value={metrics.percentSessions} className="h-2" />
          <p className="text-xs text-gray-600">{metrics.percentSessions}% de réussite</p>
        </div>

        {/* Objectif Principal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Objectif: {metrics.goalName}</span>
            </div>
            <span className="text-2xl font-bold text-purple-600">{metrics.percentGoal}%</span>
          </div>
          <Progress value={metrics.percentGoal} className="h-2" />
          <p className="text-xs text-gray-600">{metrics.weeksLeft} semaines restantes</p>
        </div>

        {/* Progression */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium">Progression</span>
            </div>
            <span className="text-2xl font-bold text-orange-600">{metrics.progression > 0 ? "+" : ""}{metrics.progression}%</span>
          </div>
          <p className="text-xs text-gray-600">Amélioration ce mois</p>
        </div>
      </CardContent>
    </Card>
  );
}
