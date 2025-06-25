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