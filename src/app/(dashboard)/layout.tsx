import "../globals.css";
import type React from "react";
import DashboardClientLayout from "@/components/layouts/DashboardClientLayout";

export const metadata = {
  title: "Beswib - Dashboard Coureur",
  description: "Dashboard pour coureurs avec plan d'entraînement personnalisé et suivi IA",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
