'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Stocker email/password dans localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('onboarding_email', email);
          localStorage.setItem('onboarding_password', password);
        }
        setMessage("Inscription réussie !");
        setEmail("");
        setPassword("");
        // Rediriger vers le questionnaire
        router.push("/onboarding/questionnaire");
      } else {
        setMessage(data.message || "Erreur lors de l'inscription");
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
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Onboarding</h1>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Mot de passe</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </button>
        {message && (
          <div className="mt-4 text-center text-sm text-red-600">{message}</div>
        )}
      </form>
    </div>
  );
} 