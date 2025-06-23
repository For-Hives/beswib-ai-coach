import { NextResponse } from "next/server";

// Mock AI-generated training plan data
const mockPlan = [
  {
    id: 1,
    date: "2024-07-01",
    type: "Endurance",
    distance: "8 km",
    duration: "45 min",
    description: "Séance d'endurance fondamentale",
  },
  {
    id: 2,
    date: "2024-07-03",
    type: "Fractionné",
    distance: "6 km",
    duration: "35 min",
    description: "Séance de fractionné court",
  },
  {
    id: 3,
    date: "2024-07-05",
    type: "Récupération",
    distance: "5 km",
    duration: "30 min",
    description: "Sortie récupération très douce",
  },
  {
    id: 4,
    date: "2024-07-07",
    type: "Long",
    distance: "15 km",
    duration: "90 min",
    description: "Sortie longue à allure modérée",
  },
];

export async function GET() {
  // In a real app, fetch/generate the plan based on the user
  return NextResponse.json(mockPlan);
} 