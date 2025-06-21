import { TrainingCalendar } from "@/components/calendar/training-calendar"

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Calendrier d'entraînement</h1>
        <p className="text-gray-600">Planifiez et suivez vos séances d'entraînement</p>
      </div>

      <TrainingCalendar />
    </div>
  )
}
