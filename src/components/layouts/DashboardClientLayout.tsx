'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Navbar } from '@/components/ui/navbar';
import { Sidebar } from '@/components/ui/sidebar';

interface DashboardClientLayoutProps {
  children: React.ReactNode;
}

const DashboardClientLayout: React.FC<DashboardClientLayoutProps> = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardClientLayout;
