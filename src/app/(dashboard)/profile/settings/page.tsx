"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import apiClient, { ApiError } from "@/lib/api";

export default function ProfileSettingsPage() {
  const pathname = usePathname();
  const router = useRouter();
  // Mock user data (à remplacer par fetch profil)
  const [email, setEmail] = useState("user@email.com");
  const [password, setPassword] = useState("********");
  const [twoFA, setTwoFA] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [supportAccess, setSupportAccess] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient<{ email: string; twofaEnabled: boolean; preferences: any }>('/api/profile');
        setEmail(data.email || "");
        setTwoFA(!!data.twofaEnabled);
        setNotifications(!!data.preferences?.notifications);
        setNewsletter(!!data.preferences?.newsletter);
      } catch (error) {
        if (error instanceof ApiError) {
          setFeedback(`Erreur: ${error.message}`);
        } else {
          setFeedback("Une erreur inattendue est survenue.");
        }
        console.error("Erreur fetch profile", error);
      }
    };
    fetchProfile();
  }, []);

  // Handlers
  const handleEmailChange = () => { setShowEmailModal(true); setNewEmail(""); setFeedback(""); };
  const handlePasswordChange = () => { setShowPasswordModal(true); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setFeedback(""); };
  
  const handleToggleSetting = async (endpoint: string, state: boolean, setState: (value: boolean) => void, settingName: string) => {
    setLoading(true);
    setFeedback("");
    try {
      await apiClient(endpoint, { method: "POST", body: JSON.stringify({ enabled: !state }) });
      setState(!state);
      setFeedback(`${settingName} mis à jour`);
    } catch (e) {
      setFeedback(`Erreur ${settingName}`);
    }
    setLoading(false);
  };
  
  const handle2FAChange = () => handleToggleSetting("/api/users/2fa", twoFA, setTwoFA, "2FA");
  const handleNotificationsChange = () => handleToggleSetting("/api/users/notifications", notifications, setNotifications, "Notifications");
  const handleNewsletterChange = () => handleToggleSetting("/api/users/newsletter", newsletter, setNewsletter, "Newsletter");

  const handleSupportAccessChange = () => { setSupportAccess(!supportAccess); };
  
  const handleLogoutAll = async () => {
    setLoading(true);
    setFeedback("");
    try {
      await apiClient("/api/users/logout-all", { method: "POST" });
      setFeedback("Déconnecté de tous les appareils");
    } catch (e) { setFeedback("Erreur déconnexion"); }
    setLoading(false);
  };
  
  const handleDeleteAccount = () => { setShowDeleteModal(true); setFeedback(""); };

  // Modals actions
  const submitEmailChange = async () => {
    setLoading(true);
    setFeedback("");
    try {
      await apiClient("/api/users/change-email", { method: "POST", body: JSON.stringify({ email: newEmail }) });
      setEmail(newEmail);
      setShowEmailModal(false);
      setFeedback("Email modifié");
    } catch (e) { setFeedback("Erreur email"); }
    setLoading(false);
  };
  const submitPasswordChange = async () => {
    setLoading(true);
    setFeedback("");
    if (newPassword !== confirmPassword) { setFeedback("Les mots de passe ne correspondent pas"); setLoading(false); return; }
    try {
      await apiClient("/api/users/change-password", { method: "POST", body: JSON.stringify({ currentPassword, newPassword }) });
      setShowPasswordModal(false);
      setFeedback("Mot de passe modifié");
    } catch (e) { setFeedback("Erreur mot de passe"); }
    setLoading(false);
  };
  const submitDeleteAccount = async () => {
    setLoading(true);
    setFeedback("");
    try {
      await apiClient("/api/users/delete-account", { method: "DELETE" });
      setShowDeleteModal(false);
      setFeedback("Compte supprimé");
      localStorage.removeItem("token");
      router.push("/login");
    } catch (e) { setFeedback("Erreur suppression"); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b mb-6">
        <Link href="/profile" className={pathname === "/profile" ? "font-bold border-b-2 border-blue-600 pb-2" : "pb-2"}>Synthèse</Link>
        <Link href="/profile/card" className={pathname === "/profile/card" ? "font-bold border-b-2 border-blue-600 pb-2" : "pb-2"}>Card</Link>
        <Link href="/profile/settings" className={pathname === "/profile/settings" ? "font-bold border-b-2 border-blue-600 pb-2" : "pb-2"}>Paramètres</Link>
      </div>
      <h1 className="text-2xl font-bold">Paramètres</h1>
      {feedback && <div className="text-center text-sm text-blue-600">{feedback}</div>}
      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input value={email} disabled className="mb-2" />
            </div>
            <Button variant="outline" onClick={handleEmailChange}>Change email</Button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input value={password} type="password" disabled className="mb-2" />
            </div>
            <Button variant="outline" onClick={handlePasswordChange}>Change password</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium">2-Step Verifications</label>
              <span className="text-xs text-gray-500">Add an additional layer of security to your account during login.</span>
            </div>
            <Checkbox checked={twoFA} onCheckedChange={handle2FAChange} />
          </div>
        </CardContent>
      </Card>
      {/* Notifications & Consentements */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications & Consentements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            <Checkbox checked={notifications} onCheckedChange={handleNotificationsChange} />
          </div>
          <div className="flex items-center justify-between">
            <span>Newsletter</span>
            <Checkbox checked={newsletter} onCheckedChange={handleNewsletterChange} />
          </div>
        </CardContent>
      </Card>
      {/* Support & Suppression */}
      <Card>
        <CardHeader>
          <CardTitle>Support Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Support access</span>
            <Checkbox checked={supportAccess} onCheckedChange={handleSupportAccessChange} />
          </div>
          <div className="flex items-center justify-between">
            <span>Log out of all devices</span>
            <Button variant="outline" onClick={handleLogoutAll}>Log out</Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-red-600">Delete my account</span>
            <Button variant="outline" className="text-red-600" onClick={handleDeleteAccount}>Delete Account</Button>
          </div>
        </CardContent>
      </Card>
      {/* Modals */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Email</DialogTitle></DialogHeader>
          <Input placeholder="New email" className="mb-4" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailModal(false)}>Cancel</Button>
            <Button onClick={submitEmailChange} disabled={loading || !newEmail}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
          <Input placeholder="Current password" type="password" className="mb-2" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          <Input placeholder="New password" type="password" className="mb-2" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          <Input placeholder="Confirm new password" type="password" className="mb-4" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
            <Button onClick={submitPasswordChange} disabled={loading || !currentPassword || !newPassword || !confirmPassword}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>2-Step Verification</DialogTitle></DialogHeader>
          <div className="mb-4">Set up or disable 2FA for your account (à implémenter).</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FAModal(false)}>Cancel</Button>
            <Button onClick={handle2FAChange} disabled={loading}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Account</DialogTitle></DialogHeader>
          <div className="mb-4 text-red-600">Are you sure you want to delete your account? This action is irreversible.</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="outline" className="text-red-600" onClick={submitDeleteAccount} disabled={loading}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}