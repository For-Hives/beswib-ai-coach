"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>
      <Card>
        <CardHeader>
          <CardTitle>Préférences et consentements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Exemple de paramètres, à compléter dynamiquement */}
          <div><b>Consentement données :</b> ...</div>
          <div><b>Notifications :</b> ...</div>
          <div><b>Newsletter :</b> ...</div>
        </CardContent>
      </Card>
    </div>
  );
} 