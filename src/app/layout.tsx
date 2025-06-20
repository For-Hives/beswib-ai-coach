import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/app/app-sidebar";
import { Header } from "@/app/header";
// import { ChatWidget } from "@/components/chat/chat-widget";
import type React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beswib - Dashboard Coureur",
  description: "Dashboard pour coureurs avec plan d'entraînement personnalisé et suivi IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-6 bg-gray-50">{children}</main>
          </div>
        </div>
        {/* <ChatWidget /> */}
      </body>
    </html>
  );
}
