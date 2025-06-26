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
  details?: string;
  average_speed?: number | string;
  average_heartrate?: number;
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
    case "Renforcement musculaire":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function parseLocalDate(dateStr: string | null | undefined) {
  if (!dateStr || typeof dateStr !== "string") return new Date(NaN);
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function detectSessionType(session: TrainingSession): string {
  if (session.type === "Renforcement musculaire") {
    return "Renforcement musculaire";
  }
  if (session.distance) {
    const match = session.distance.match(/(\d+([.,]\d+)?)\s*km/i);
    if (match && parseFloat(match[1].replace(',', '.')) >= 20) {
      return "Long";
    }
  }
  if (session.description?.toLowerCase().includes("fractionné")) {
    return "Fractionné";
  }
  if (session.description?.toLowerCase().includes("allure lente de récupération")) {
    return "Récupération";
  }
  return "Endurance";
}

function convertSpeedToPace(speed: number | string | undefined) {
  if (!speed) return "-";
  const s = typeof speed === "string" ? parseFloat(speed) : speed;
  if (!s || isNaN(s)) return "-";
  const pace = 1000 / (s * 60); // m/s → min/km
  const min = Math.floor(pace);
  const sec = Math.round((pace - min) * 60).toString().padStart(2, "0");
  return `${min}:${sec} min/km`;
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
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7

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
    return sessions.filter((session) => {
      const sessionDate = parseLocalDate(session.date);
      if (!session.distance && detectSessionType(session) !== "Renforcement musculaire") return false;
      return (
        sessionDate.getFullYear() === date.getFullYear() &&
        sessionDate.getMonth() === date.getMonth() &&
        sessionDate.getDate() === date.getDate()
      );
    });
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
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
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
                  {daysSessions.map((session, idx) => {
                    const s: any = session;
                    const key = session.id ?? `${session.date || ''}-${session.type || ''}-${s.semaine || ''}-${s.phase || ''}-${idx}`;
                    const descId = `session-desc-${key}`;
                    const sessionType = detectSessionType(session);
                    return (
                      <Dialog key={key}>
                        <DialogTrigger asChild>
                          <div
                            className={`text-xs p-1 rounded cursor-pointer border ${getSessionColor(sessionType)} ${
                              session.completed ? "opacity-75" : ""
                            }`}
                            onClick={() => setSelectedSession(session)}
                          >
                            {sessionType}
                            {session.completed && " ✓"}
                          </div>
                        </DialogTrigger>
                        <DialogContent aria-describedby={descId}>
                          <DialogHeader>
                            <DialogTitle>Détails de la séance</DialogTitle>
                          </DialogHeader>
                          <p id={descId} className="sr-only">
                            Détail complet de la séance d'entraînement sélectionnée, incluant type, date, distance, durée et description.
                          </p>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Badge className={getSessionColor(sessionType)}>{sessionType}</Badge>
                              <span className="text-sm text-gray-600">
                                {new Date(session.date).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {(session.distance || session.duration) ? (
                                <>
                                  <div>
                                    <p className="text-sm font-medium">Distance</p>
                                    <p className="text-lg">{session.distance || "-"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Durée</p>
                                    <p className="text-lg">{session.duration || "-"}</p>
                                  </div>
                                </>
                              ) : null}
                              {(session.average_speed || session.average_heartrate) && (
                                <>
                                  {session.average_speed && (
                                    <div>
                                      <p className="text-sm font-medium">Allure moyenne</p>
                                      <p className="text-lg">{convertSpeedToPace(session.average_speed)}</p>
                                    </div>
                                  )}
                                  {session.average_heartrate && (
                                    <div>
                                      <p className="text-sm font-medium">FC Moyenne</p>
                                      <p className="text-lg">{session.average_heartrate} bpm</p>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            {(session.details || session.description) && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Description</p>
                                <p className="text-gray-700">{session.details || session.description}</p>
                              </div>
                            )}
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
                    );
                  })}
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
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span className="text-sm">Renforcement musculaire</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
