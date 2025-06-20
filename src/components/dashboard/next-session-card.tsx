import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Zap, Play } from "lucide-react"

export function NextSessionCard() {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Prochaine séance</CardTitle>
          <Badge variant="secondary" className="bg-white/20 text-white">
            Aujourd'hui 18h00
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <div>
              <p className="text-sm opacity-90">Distance</p>
              <p className="font-semibold">8 km</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <div>
              <p className="text-sm opacity-90">Type</p>
              <p className="font-semibold">Endurance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <div>
              <p className="text-sm opacity-90">Durée estimée</p>
              <p className="font-semibold">45 min</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="font-semibold mb-2">💡 Conseils IA</h4>
          <p className="text-sm opacity-90">
            Parfait pour une séance d'endurance ! Maintenez un rythme confortable, vous devriez pouvoir tenir une
            conversation. Hydratez-vous bien avant et après.
          </p>
        </div>

        <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
          <Play className="w-4 h-4 mr-2" />
          Commencer la séance
        </Button>
      </CardContent>
    </Card>
  )
}
