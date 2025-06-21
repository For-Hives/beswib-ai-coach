import "../globals.css";
import { AppSidebar } from "@/app/app-sidebar";
import { Header } from "@/app/header";
// import { ChatWidget } from "@/components/chat/chat-widget";
import type React from "react";

export const metadata = {
  title: "Beswib - Dashboard Coureur",
  description: "Dashboard pour coureurs avec plan d'entraînement personnalisé et suivi IA",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
} 