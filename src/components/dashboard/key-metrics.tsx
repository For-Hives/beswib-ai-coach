import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MapPin, Target, Trophy, TrendingUp } from "lucide-react"

export function KeyMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métriques clés</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Km totaux</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">247</span>
          </div>
          <p className="text-xs text-gray-600">Ce mois-ci</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Séances réalisées</span>
            </div>
            <span className="text-2xl font-bold text-green-600">18/20</span>
          </div>
          <Progress value={90} className="h-2" />
          <p className="text-xs text-gray-600">90% de réussite</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Objectif Marathon</span>
            </div>
            <span className="text-2xl font-bold text-purple-600">78%</span>
          </div>
          <Progress value={78} className="h-2" />
          <p className="text-xs text-gray-600">12 semaines restantes</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium">Progression</span>
            </div>
            <span className="text-2xl font-bold text-orange-600">+12%</span>
          </div>
          <p className="text-xs text-gray-600">Amélioration ce mois</p>
        </div>
      </CardContent>
    </Card>
  )
}
