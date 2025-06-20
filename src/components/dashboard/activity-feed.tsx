import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, MapPin, Zap } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "Endurance",
    distance: "10.2 km",
    duration: "52 min",
    pace: "5:06 min/km",
    date: "Hier",
    feedback: "Excellente séance ! Rythme parfaitement maîtrisé.",
    color: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    type: "Fractionné",
    distance: "6.5 km",
    duration: "35 min",
    pace: "4:32 min/km",
    date: "Il y a 2 jours",
    feedback: "Bonne intensité sur les fractions. Récupération à améliorer.",
    color: "bg-red-100 text-red-800",
  },
  {
    id: 3,
    type: "Récupération",
    distance: "5.0 km",
    duration: "30 min",
    pace: "6:00 min/km",
    date: "Il y a 3 jours",
    feedback: "Parfait pour la récupération. Continuez ainsi !",
    color: "bg-blue-100 text-blue-800",
  },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
        <p className="text-gray-600">Dernières séances avec feedback IA</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Badge className={activity.color}>{activity.type}</Badge>
              <span className="text-sm text-gray-500">{activity.date}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span>{activity.distance}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span>{activity.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-gray-400" />
                <span>{activity.pace}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  IA
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-gray-700 flex-1">{activity.feedback}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
