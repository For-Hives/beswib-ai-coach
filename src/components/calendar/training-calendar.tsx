"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"

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
  name?: string;
  elevation?: number;
  timeGoal?: string;
  isIndispo?: boolean;
  isGoal?: boolean;
  intensity?: number;
  rpe?: number;
}

interface TrainingCalendarProps {
  sessions?: TrainingSession[];
  onDeleteIndispo?: (date: string) => void;
  onEventClick?: (session: TrainingSession) => void;
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
    case "Seuil":
      return "bg-orange-100 text-orange-800 border-orange-200"
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
  if (session.type === "Repos") {
    return "Récupération";
  }

  if (session.intensity) {
    if (session.intensity >= 5) return "Fractionné";
    if (session.intensity >= 3) return "Seuil";
    if (session.intensity === 2) return "Endurance";
    if (session.intensity <= 1) return "Récupération";
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
  if (session.description?.toLowerCase().includes("récupération")) {
    return "Récupération";
  }

  return session.type || "Endurance";
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

function getCourseInfo(session: any) {
  if (!session) return null;
  if (session.type && (session.type.toLowerCase().includes("course") || session.type.toLowerCase().includes("objectif"))) {
    return {
      name: session.name || session.details || session.description || "Course",
      distance: session.distance,
      elevation: session.elevation,
      timeGoal: session.timeGoal,
      date: session.date,
    };
  }
  return null;
}

export function TrainingCalendar({ sessions = [], onDeleteIndispo, onEventClick }: TrainingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const handleSessionClick = (session: TrainingSession) => {
    if (onEventClick) {
      onEventClick(session);
    }
  };

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
      // Affiche toujours les indispos et les objectifs
      if ((session as any).isIndispo || session.type === "Indisponibilité" || (session as any).isGoal || session.type === "Objectif") {
        return (
          sessionDate.getFullYear() === date.getFullYear() &&
          sessionDate.getMonth() === date.getMonth() &&
          sessionDate.getDate() === date.getDate()
        );
      }
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
                    const isGoal = (s.isGoal || session.type === "Objectif");
                    const isIndispo = s.isIndispo || session.type === "Indisponibilité";
                    if (isIndispo) {
                      return (
                        <div key={key} className="flex items-center gap-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white rounded-full text-xs font-bold">
                            Indispo
                            {s.description && <span className="ml-1 font-normal">{s.description}</span>}
                          </span>
                          {onDeleteIndispo && (
                            <button onClick={() => onDeleteIndispo(s.date)} className="ml-1 text-red-600 hover:text-red-800" title="Supprimer l'indisponibilité">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                          )}
                        </div>
                      );
                    }
                    if (!isGoal && detectSessionType(session) === "Renforcement musculaire" && !session.description) return null;
                    return (
                      <button key={key} onClick={() => handleSessionClick(session)} className="w-full text-left">
                        <div
                          className={`text-xs p-1 rounded cursor-pointer border ${isGoal ? "bg-purple-100 text-purple-900 border-purple-300 font-bold" : getSessionColor(sessionType)} ${session.completed ? "opacity-75" : ""}`}
                        >
                          <p className="font-medium truncate" id={descId}>
                            {isGoal ? (session.name || "Objectif") : `${sessionType}${session.name ? `: ${session.name}` : ''}`}
                          </p>
                          {session.completed && <span className="text-green-600 font-bold">✓</span>}
                        </div>
                      </button>
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
            <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded"></div>
            <span className="text-sm">Seuil</span>
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
