"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export interface TrainingSession {
  id: number;
  date: string;
  type: string;
  distance: string;
  duration: string;
  description?: string;
  completed?: boolean;
}

interface TrainingCalendarProps {
  sessions?: TrainingSession[];
}

const getSessionColor = (type: string) => {
  switch (type) {
    case "Endurance":
      return "bg-green-100 text-green-800 border-green-200"
    case "Fractionné":
      return "bg-red-100 text-red-800 border-red-200"
    case "Récupération":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Long":
      return "bg-purple-100 text-purple-800 border-purple-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function TrainingCalendar({ sessions = [] }: TrainingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedSession, setSelectedSession] = useState<any>(null)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true })
    }

    return days
  }

  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return sessions.filter((session) => session.date === dateStr)
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const daysSessions = getSessionsForDate(day.date)
            return (
              <div
                key={index}
                className={`min-h-[80px] p-1 border rounded ${day.isCurrentMonth ? "bg-white" : "bg-gray-50"}`}
              >
                <div className={`text-sm ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}`}>
                  {day.date.getDate()}
                </div>
                <div className="space-y-1 mt-1">
                  {daysSessions.map((session) => (
                    <Dialog key={session.id}>
                      <DialogTrigger asChild>
                        <div
                          className={`text-xs p-1 rounded cursor-pointer border ${getSessionColor(session.type)} ${
                            session.completed ? "opacity-75" : ""
                          }`}
                          onClick={() => setSelectedSession(session)}
                        >
                          {session.type}
                          {session.completed && " ✓"}
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Détails de la séance</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge className={getSessionColor(session.type)}>{session.type}</Badge>
                            <span className="text-sm text-gray-600">
                              {new Date(session.date).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Distance</p>
                              <p className="text-lg">{session.distance}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Durée</p>
                              <p className="text-lg">{session.duration}</p>
                            </div>
                          </div>
                          {session.completed ? (
                            <div className="p-3 bg-green-50 rounded-lg">
                              <p className="text-green-800 font-medium">✓ Séance terminée</p>
                              <p className="text-sm text-green-600">Bonne performance ! Continuez ainsi.</p>
                            </div>
                          ) : (
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-blue-800 font-medium">📅 Séance programmée</p>
                              <p className="text-sm text-blue-600">N'oubliez pas votre séance d'entraînement.</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-sm">Endurance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-sm">Fractionné</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
            <span className="text-sm">Récupération</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded"></div>
            <span className="text-sm">Long</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
