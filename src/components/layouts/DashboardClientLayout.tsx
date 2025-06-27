'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Navbar } from '@/components/ui/navbar';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Mon plan d'entrainement", href: "/training" },
  { label: "Calendrier", href: "/calendar" },
  { label: "Profil", href: "/profile" },
  { label: "Coaches", href: "/coaches" },
]

const DashboardClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isSidebarOpen && (
        <Sidebar>
          <SidebarHeader className="p-4">
            <h2 className="text-xl font-bold">Beswib</h2>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarMenu>
              {links.map(link => (
                <SidebarMenuItem key={link.href}>
                  <Link href={link.href} passHref>
                    <SidebarMenuButton asChild isActive={pathname === link.href}>
                      {link.label}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      )}
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={toggleSidebar} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardClientLayout;
