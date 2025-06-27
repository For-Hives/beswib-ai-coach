"use client";
import React, { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider"; 
import apiClient, { ApiError } from "@/lib/api";

// Définition du type de la réponse de l'API de connexion
interface LoginResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    // ... autres champs utilisateur
  };
}

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await apiClient<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      login(data.token, data.user); 
      setMessage("Connexion réussie !");

    } catch (err) {
      if (err instanceof ApiError) {
        setMessage(err.message || "Erreur lors de la connexion");
      } else {
        setMessage("Une erreur de connexion inattendue est survenue.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
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
        {loading ? "Connexion..." : "Se connecter"}
      </button>
      {message && (
        <div className="mt-2 text-center text-sm text-red-600">{message}</div>
      )}
    </form>
  );
}
