import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MessageCircle, Calendar } from "lucide-react"

export default function CoachesPage() {
  const coaches = [
    {
      id: 1,
      name: "Marie Leblanc",
      specialty: "Marathon & Ultra",
      rating: 4.9,
      experience: "8 ans",
      price: "80€/mois",
      available: true,
      image: "/placeholder.svg?height=64&width=64",
    },
    {
      id: 2,
      name: "Pierre Martin",
      specialty: "Vitesse & 10K",
      rating: 4.8,
      experience: "5 ans",
      price: "65€/mois",
      available: false,
      image: "/placeholder.svg?height=64&width=64",
    },
    {
      id: 3,
      name: "Sophie Durand",
      specialty: "Trail & Nature",
      rating: 4.9,
      experience: "6 ans",
      price: "75€/mois",
      available: true,
      image: "/placeholder.svg?height=64&width=64",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Coachs</h1>
        <p className="text-gray-600">Trouvez le coach parfait pour atteindre vos objectifs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <Card key={coach.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Avatar className="w-16 h-16 mx-auto mb-4">
                <AvatarImage src={coach.image || "/placeholder.svg"} />
                <AvatarFallback>
                  {coach.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{coach.name}</CardTitle>
              <p className="text-gray-600">{coach.specialty}</p>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{coach.rating}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Expérience</span>
                  <span>{coach.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tarif</span>
                  <span className="font-semibold text-green-600">{coach.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Disponibilité</span>
                  <Badge variant={coach.available ? "default" : "secondary"}>
                    {coach.available ? "Disponible" : "Complet"}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  disabled={!coach.available}
                  variant={coach.available ? "default" : "secondary"}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Réserver
                </Button>
                <Button variant="outline" size="icon">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
