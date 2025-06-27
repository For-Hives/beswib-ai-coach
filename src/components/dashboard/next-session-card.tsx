"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Zap, Play, Loader2 } from "lucide-react"
import { useNextSession } from "@/hooks/useNextSession";
import { useRouter } from "next/navigation";

const formatSessionDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
        return "Aujourd'hui";
    }
    if (date.getTime() === tomorrow.getTime()) {
        return "Demain";
    }
    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long'
    }).format(date);
};


export function NextSessionCard() {
    const { session, isLoading, error } = useNextSession();
    const router = useRouter();

    const handleDetailsClick = () => {
        if (session) {
            router.push(`/training?sessionId=${session.id}`);
        }
    };

    if (isLoading) {
        return (
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="ml-4 text-lg">Chargement de la prochaine séance...</p>
            </Card>
        )
    }

    if (error || !session) {
        return (
            <Card className="bg-gradient-to-r from-gray-400 to-gray-500 text-white">
                <CardHeader>
                    <CardTitle className="text-xl">Prochaine séance</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error?.message || "Aucune séance à venir n'a été trouvée."}</p>
                    <p className="text-sm opacity-80 mt-2">Vous pouvez générer un plan depuis la page d'entrainement.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Prochaine séance</CardTitle>
                    <Badge className="bg-white/20 text-white">
                        {formatSessionDate(session.date)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <div>
                            <p className="text-sm opacity-90">Distance</p>
                            <p className="font-semibold">{session.distance_km ? `${session.distance_km} km` : '-'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        <div>
                            <p className="text-sm opacity-90">Type</p>
                            <p className="font-semibold">{session.sessionType}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <div>
                            <p className="text-sm opacity-90">Durée estimée</p>
                            <p className="font-semibold">{session.duration_min} min</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">💡 {session.title}</h4>
                    <p className="text-sm opacity-90">
                        {session.description}
                    </p>
                </div>

                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100" onClick={handleDetailsClick}>
                    <Play className="w-4 h-4 mr-2" />
                    Voir les détails
                </Button>
            </CardContent>
        </Card>
    )
}
