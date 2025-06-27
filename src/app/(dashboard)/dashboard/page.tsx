"use client";
import { NextSessionCard } from "@/components/dashboard/next-session-card"
import { ProgressChart } from "@/components/dashboard/progress-chart"
import KeyMetrics from "@/components/dashboard/key-metrics"
import RecentActivities from "@/components/strava/RecentActivities"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bienvenue sur votre tableau de bord d'entraînement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <NextSessionCard />
          <ProgressChart />
        </div>

        <div className="space-y-6">
          <RecentActivities />
          <KeyMetrics />
        </div>
      </div>
    </div>
  )
}