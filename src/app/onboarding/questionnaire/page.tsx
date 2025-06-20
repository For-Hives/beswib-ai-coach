'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QuestionnairePage() {
  const [prenom, setPrenom] = useState("");
  const [age, setAge] = useState("");
  const [sexe, setSexe] = useState("");
  const [niveau, setNiveau] = useState("");
  const [objectif, setObjectif] = useState("");
  const [dateCible, setDateCible] = useState("");
  const [seances, setSeances] = useState("");
  const [jours, setJours] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('onboarding_email') || "";
      const storedPassword = localStorage.getItem('onboarding_password') || "";
      setEmail(storedEmail);
      setPassword(storedPassword);
    }
  }, []);

  const joursOptions = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  const handleJoursChange = (jour: string) => {
    setJours((prev) =>
      prev.includes(jour) ? prev.filter((j) => j !== jour) : [...prev, jour]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (!email || !password) {
      setMessage("Merci de compléter d'abord l'inscription.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          profile: { prenom, age, sexe, niveau },
          goals: { objectif, dateCible },
          preferences: { seances, jours }
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Questionnaire envoyé avec succès !");
        if (typeof window !== 'undefined') {
          localStorage.removeItem('onboarding_email');
          localStorage.removeItem('onboarding_password');
        }
        // Rediriger vers le dashboard après 1 seconde
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setMessage(data.message || "Erreur lors de l'envoi");
      }
    } catch (err) {
      setMessage("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Questionnaire d'Onboarding</h1>
        {!email || !password ? (
          <div className="text-red-600 text-center mb-4">Merci de compléter d'abord l'inscription.</div>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Prénom</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={prenom} onChange={e => setPrenom(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Âge</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={age} onChange={e => setAge(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Sexe</label>
            <select className="w-full border rounded px-3 py-2" value={sexe} onChange={e => setSexe(e.target.value)} required>
              <option value="">Sélectionner</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Niveau sportif</label>
            <select className="w-full border rounded px-3 py-2" value={niveau} onChange={e => setNiveau(e.target.value)} required>
              <option value="">Sélectionner</option>
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Objectif principal</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={objectif} onChange={e => setObjectif(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Date cible</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={dateCible} onChange={e => setDateCible(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Séances/semaine</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={seances} onChange={e => setSeances(e.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Jours préférés</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {joursOptions.map(jour => (
                <label key={jour} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={jours.includes(jour)}
                    onChange={() => handleJoursChange(jour)}
                  />
                  <span>{jour}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mt-6"
          disabled={loading || !email || !password}
        >
          {loading ? "Envoi..." : "Envoyer"}
        </button>
        {message && (
          <div className="mt-4 text-center text-sm text-red-600">{message}</div>
        )}
      </form>
    </div>
  );
} 