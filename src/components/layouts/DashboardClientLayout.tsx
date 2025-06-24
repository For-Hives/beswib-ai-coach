'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import { AppSidebar } from '@/app/app-sidebar';
import { Header } from '@/app/header';

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading]);

  // Attend que l'auth soit chargée avant de décider quoi faire
  if (loading) return <p>Chargement...</p>; // ou un spinner

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}


export default function DashboardClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutWrapper>{children}</LayoutWrapper>
    </AuthProvider>
  );
}
