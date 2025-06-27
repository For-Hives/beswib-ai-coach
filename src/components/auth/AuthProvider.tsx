'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
      setLoading(true); 
      fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then(async (res) => {
          console.log('🔍 Requête /profile status:', res.status);
          if (!res.ok) throw new Error('Token invalide');
          const data = await res.json();
          console.log('👤 Utilisateur récupéré :', data);
          setUser(data);
          localStorage.setItem('profile', JSON.stringify({
            email: data.email || '',
            avatar: data.profile?.avatar || '',
          }));
          setLoading(false); 
        })
        .catch((err) => {
          console.warn('⛔ Erreur fetch /profile:', err.message);
          localStorage.removeItem('token');
          localStorage.removeItem('profile');
          setToken(null);
          setUser(null);
          router.push('/login');
          setLoading(false); 
        });
    }
  }, []);

  const login = (newToken: string, userData?: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    console.log('✅ Login enregistré avec token:', newToken);

    if (userData) {
      setUser(userData);
      localStorage.setItem('profile', JSON.stringify({
        email: userData.email || '',
        avatar: (userData as any).avatar || '',
      }));
    } else {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Token invalide');
          const data = await res.json();
          setUser(data);
          localStorage.setItem('profile', JSON.stringify({
            email: data.email || '',
            avatar: data.profile?.avatar || '',
          }));
        })
        .catch((err) => {
          console.warn('⛔ Erreur post-login /profile:', err.message);
          localStorage.removeItem('token');
          localStorage.removeItem('profile');
          setToken(null);
          setUser(null);
          router.push('/login');
        });
    }

    router.push('/dashboard');
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
