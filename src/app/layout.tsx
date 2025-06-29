import type { Metadata } from "next";
import "./globals.css";
import type React from "react";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider"; // ⬅️ Ajout de l'import

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
      <body className={inter.className}>
        <AuthProvider> {/* ⬅️ Enveloppe ici */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}