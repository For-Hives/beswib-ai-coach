'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';

type User = {
  _id: string;
  email: string;
  avatar?: string;
  profile?: {
    avatar?: string;
  };
  // ajoute ici d'autres champs selon ton modèle
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData?: User) => void;
  logout: () => void;
  loading: boolean; 
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('🔐 Token récupéré du localStorage:', storedToken);

    if (storedToken) {
      setToken(storedToken);
      
      const verifyToken = async (tokenToVerify: string) => {
        setLoading(true);
        try {
          const data = await apiClient<User>('/api/profile', {
            // Le token est ajouté par apiClient, mais on pourrait vouloir
            // forcer l'utilisation de celui-ci spécifiquement.
            // Pour l'instant, on se fie au localStorage que apiClient va lire.
          });

          console.log('👤 Utilisateur récupéré via verifyToken:', data);
          setUser(data);
          localStorage.setItem('profile', JSON.stringify({
            email: data.email || '',
            avatar: data.profile?.avatar || data.avatar || '',
          }));

        } catch (err) {
          console.warn('⛔ Token invalide ou expiré:', err);
          // Nettoyage si le token est invalide
          localStorage.removeItem('token');
          localStorage.removeItem('profile');
          setToken(null);
          setUser(null);
          router.push('/login');
        } finally {
          setLoading(false);
        }
      };

      verifyToken(storedToken);
    } else {
      setLoading(false); // Pas de token, on ne charge rien
    }
  }, []); // Ne dépend que du montage initial

  const login = async (newToken: string, userData?: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    console.log('✅ Login enregistré avec token:', newToken);

    if (userData) {
      setUser(userData);
      localStorage.setItem('profile', JSON.stringify({
        email: userData.email || '',
        avatar: (userData as any).profile?.avatar || (userData as any).avatar || '',
      }));
      router.push('/dashboard');
    } else {
      // Si userData n'est pas fourni, on le fetch
      try {
        const data = await apiClient<User>('/api/profile'); // apiClient utilise le token fraîchement stocké
        setUser(data);
        localStorage.setItem('profile', JSON.stringify({
            email: data.email || '',
            avatar: data.profile?.avatar || data.avatar || '',
        }));
        router.push('/dashboard');
      } catch (err) {
        console.warn('⛔ Erreur post-login /profile:', err);
        // En cas d'erreur, on nettoie pour éviter un état incohérent
        logout();
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        loading, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
