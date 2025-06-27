'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Navbar } from '@/components/ui/navbar';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { ChatbotFab } from '../ui/ChatbotFab';
import { FeedbackChatbot } from '../feedback/FeedbackChatbot';
import { useSessionForFeedback } from '@/hooks/useSessionForFeedback';

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Mon plan d'entrainement", href: "/training" },
  { label: "Calendrier", href: "/calendar" },
  { label: "Profil", href: "/profile" },
  { label: "Coaches", href: "/coaches" },
]

const DashboardClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading: authLoading } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isChatbotOpen, setChatbotOpen] = useState(false);
  const pathname = usePathname();
  const { sessionForFeedback, loading: feedbackLoading } = useSessionForFeedback();

  useEffect(() => {
    // Automatically open the chatbot if a session is found after loading
    if (!feedbackLoading && sessionForFeedback) {
      setChatbotOpen(true);
    }
  }, [sessionForFeedback, feedbackLoading]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  if (authLoading) {
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
      <AnimatePresence>
        {isChatbotOpen 
            ? <FeedbackChatbot session={sessionForFeedback || undefined} onClose={() => setChatbotOpen(false)} />
            : <ChatbotFab onClick={() => setChatbotOpen(true)} />
        }
      </AnimatePresence>
    </div>
  );
};

export default DashboardClientLayout;
