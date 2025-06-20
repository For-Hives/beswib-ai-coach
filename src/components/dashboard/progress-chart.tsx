"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { week: "S1", distance: 25, pace: 5.2 },
  { week: "S2", distance: 28, pace: 5.1 },
  { week: "S3", distance: 32, pace: 5.0 },
  { week: "S4", distance: 30, pace: 4.9 },
  { week: "S5", distance: 35, pace: 4.8 },
  { week: "S6", distance: 38, pace: 4.7 },
  { week: "S7", distance: 42, pace: 4.6 },
  { week: "S8", distance: 40, pace: 4.5 },
]

export function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution des performances</CardTitle>
        <p className="text-gray-600">Distance hebdomadaire et allure moyenne</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) => [
                  name === "distance" ? `${value} km` : `${value} min/km`,
                  name === "distance" ? "Distance" : "Allure",
                ]}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="distance"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="pace"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
