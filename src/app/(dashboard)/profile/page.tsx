"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage as AvatarImg } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Trophy, Target, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [avatar, setAvatar] = useState(profile?.avatar || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [stravaPrs, setStravaPrs] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data.profile)
        setFirstName(data.profile?.firstName || "")
        setLastName(data.profile?.lastName || "")
        setAvatar(data.profile?.avatar || "")
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch("http://localhost:3000/api/strava/prs", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setStravaPrs)
  }, [])

  const handleEdit = () => {
    setFirstName(profile?.firstName || "")
    setLastName(profile?.lastName || "")
    setAvatar(profile?.avatar || "")
    setAvatarFile(null)
    setEditOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
      setAvatar(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    let avatarUrl = avatar
    if (avatarFile) {
      const formData = new FormData()
      formData.append("file", avatarFile)
      const uploadRes = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      })
      const uploadData = await uploadRes.json()
      avatarUrl = uploadData.url
    }
    const token = localStorage.getItem("token")
    await fetch("/api/save-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...profile, firstName, lastName, avatar: avatarUrl }),
    })
    setProfile((p: any) => ({ ...p, firstName, lastName, avatar: avatarUrl }))
    setEditOpen(false)
    setIsSaving(false)
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b mb-6">
        <Link href="/profile" className={pathname === "/profile" ? "font-bold border-b-2 border-blue-600 pb-2" : "pb-2"}>Synthèse</Link>
        <Link href="/profile/card" className={pathname === "/profile/card" ? "font-bold border-b-2 border-blue-600 pb-2" : "pb-2"}>Card</Link>
        <Link href="/profile/settings" className={pathname === "/profile/settings" ? "font-bold border-b-2 border-blue-600 pb-2" : "pb-2"}>Paramètres</Link>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et objectifs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImg src={profile?.avatar || "/placeholder.svg?height=96&width=96"} />
              {!profile?.avatar && (
                <AvatarFallback className="text-2xl">
                  {(profile?.firstName?.[0] || "") + (profile?.lastName?.[0] || "")}
                </AvatarFallback>
              )}
            </Avatar>
            <CardTitle>{profile?.firstName} {profile?.lastName}</CardTitle>
            <p className="text-gray-600">Coureur passionné</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Niveau</span>
              <Badge className="bg-gray-300 text-gray-700">{profile?.level || "-"}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expérience</span>
              <span>{profile?.experience || "-"}</span>
            </div>
            <Button className="w-full" variant="outline" onClick={handleEdit}>
              <Settings className="w-4 h-4 mr-2" />
              Modifier le profil
            </Button>
            <div className="mt-4 flex justify-center">
              <Button
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 font-semibold"
                onClick={() => {
                  const token = localStorage.getItem("token") || "";
                  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || "";
                  const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI || "http://localhost:3000/api/strava/callback");
                  const scope = 'activity:read_all,profile:read_all';
                  const url = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=auto&scope=${scope}&state=${token}`;
                  console.log(process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID)
                  console.log(process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI)
                  window.location.href = url;
                }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"><path d="M12 2l4.5 9h-9L12 2zm0 20l-4.5-9h9L12 22z" fill="currentColor"/></svg>
                Connecter mon Strava
              </Button>
            </div>
            <Button
              className="mt-4 bg-blue-600 text-white"
              onClick={async () => {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:3000/api/strava/sync", {
                  headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                alert(data.message || "Synchronisation terminée !");
              }}
            >
              Synchroniser mes activités Strava
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Objectifs actuels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900">Marathon de Paris 2024</h3>
                <p className="text-blue-700">Objectif : 3h30</p>
                <p className="text-sm text-blue-600">Date : 7 avril 2024</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900">10km en moins de 45min</h3>
                <p className="text-green-700">Objectif intermédiaire</p>
                <p className="text-sm text-green-600">Date cible : 15 février 2024</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Réalisations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="font-semibold">12</p>
                  <p className="text-sm text-gray-600">Courses terminées</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold">156</p>
                  <p className="text-sm text-gray-600">Séances réalisées</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Stats Strava
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stravaPrs ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Running */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="font-semibold text-blue-900 mb-2">Running</p>
                      <div><b>Distance totale :</b> {(stravaPrs.all_run_totals?.distance / 1000).toFixed(1)} km</div>
                      <div><b>Séances :</b> {stravaPrs.all_run_totals?.count}</div>
                      <div><b>Dénivelé cumulé :</b> {Math.round(stravaPrs.all_run_totals?.elevation_gain || 0)} m</div>
                      <div className="mt-2 text-sm text-blue-800 font-semibold">Année en cours</div>
                      <div><b>Distance :</b> {(stravaPrs.ytd_run_totals?.distance / 1000).toFixed(1)} km</div>
                      <div><b>Séances :</b> {stravaPrs.ytd_run_totals?.count}</div>
                      <div><b>Dénivelé :</b> {Math.round(stravaPrs.ytd_run_totals?.elevation_gain || 0)} m</div>
                      <div className="mt-2 text-sm text-blue-800 font-semibold">4 dernières semaines</div>
                      <div><b>Distance :</b> {(stravaPrs.recent_run_totals?.distance / 1000).toFixed(1)} km</div>
                      <div><b>Séances :</b> {stravaPrs.recent_run_totals?.count}</div>
                      <div><b>Dénivelé :</b> {Math.round(stravaPrs.recent_run_totals?.elevation_gain || 0)} m</div>
                    </div>
                    {/* Cyclisme */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="font-semibold text-green-900 mb-2">Cyclisme</p>
                      <div><b>Distance totale :</b> {(stravaPrs.all_ride_totals?.distance / 1000).toFixed(1)} km</div>
                      <div><b>Séances :</b> {stravaPrs.all_ride_totals?.count}</div>
                      <div><b>Dénivelé cumulé :</b> {Math.round(stravaPrs.all_ride_totals?.elevation_gain || 0)} m</div>
                      <div className="mt-2 text-sm text-green-800 font-semibold">Année en cours</div>
                      <div><b>Distance :</b> {(stravaPrs.ytd_ride_totals?.distance / 1000).toFixed(1)} km</div>
                      <div><b>Séances :</b> {stravaPrs.ytd_ride_totals?.count}</div>
                      <div><b>Dénivelé :</b> {Math.round(stravaPrs.ytd_ride_totals?.elevation_gain || 0)} m</div>
                      <div className="mt-2 text-sm text-green-800 font-semibold">4 dernières semaines</div>
                      <div><b>Distance :</b> {(stravaPrs.recent_ride_totals?.distance / 1000).toFixed(1)} km</div>
                      <div><b>Séances :</b> {stravaPrs.recent_ride_totals?.count}</div>
                      <div><b>Dénivelé :</b> {Math.round(stravaPrs.recent_ride_totals?.elevation_gain || 0)} m</div>
                      <div className="mt-2 text-sm text-green-800 font-semibold">Records</div>
                      <div><b>Plus longue sortie :</b> {(stravaPrs.biggest_ride_distance / 1000).toFixed(1)} km</div>
                      <div><b>Plus gros dénivelé :</b> {Math.round(stravaPrs.biggest_climb_elevation_gain || 0)} m</div>
                    </div>
                    {/* Natation */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="font-semibold text-purple-900 mb-2">Natation</p>
                      <div><b>Distance totale :</b> {(stravaPrs.all_swim_totals?.distance / 1000).toFixed(1)} km</div>
                      <div><b>Séances :</b> {stravaPrs.all_swim_totals?.count}</div>
                      <div><b>Temps total :</b> {Math.round((stravaPrs.all_swim_totals?.moving_time || 0) / 60)} min</div>
                      <div className="mt-2 text-sm text-purple-800 font-semibold">Année en cours</div>
                      <div><b>Distance :</b> {(stravaPrs.ytd_swim_totals?.distance / 1000).toFixed(1)} km</div>
                      <div><b>Séances :</b> {stravaPrs.ytd_swim_totals?.count}</div>
                      <div><b>Temps :</b> {Math.round((stravaPrs.ytd_swim_totals?.moving_time || 0) / 60)} min</div>
                      <div className="mt-2 text-sm text-purple-800 font-semibold">4 dernières semaines</div>
                      <div><b>Distance :</b> {(stravaPrs.recent_swim_totals?.distance / 1000).toFixed(1)} km</div>
                      <div><b>Séances :</b> {stravaPrs.recent_swim_totals?.count}</div>
                      <div><b>Temps :</b> {Math.round((stravaPrs.recent_swim_totals?.moving_time || 0) / 60)} min</div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Aucune statistique Strava trouvée.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le profil</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label>Photo de profil</Label>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImg src={avatar || "/placeholder.svg?height=96&width=96"} />
                  {!avatar && (
                    <AvatarFallback>
                      {(firstName?.[0] || "") + (lastName?.[0] || "")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}