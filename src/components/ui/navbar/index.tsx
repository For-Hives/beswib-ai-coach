"use client"

import * as React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthProvider"
import { DesktopNav } from "./DesktopNav"
import { MobileNav } from "./MobileNav"

interface NavbarProps {
  onMenuClick?: () => void;
}

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Mon plan d'entrainement", href: "/training" },
  { label: "Calendrier", href: "/calendar" },
  { label: "Profil", href: "/profile" },
  { label: "Coaches", href: "/coaches" },
]

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { user, logout } = useAuth()

  const userProfile = {
    avatar: user?.profile?.avatar || user?.avatar || "",
    initial: user?.email ? user.email[0].toUpperCase() : "?",
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="flex justify-center w-full py-6 px-4">
      <div className="flex items-center px-6 py-3 bg-white rounded-full shadow-lg w-full max-w-full relative z-10">
        <div className="flex items-center">
          <motion.div
            className="w-8 h-8 mr-6 cursor-pointer"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.3 }}
            onClick={onMenuClick}
          >
            <Menu className="w-8 h-8 text-orange-500" />
          </motion.div>
        </div>
        
        <DesktopNav links={links} userProfile={userProfile} onLogout={handleLogout} />
        
        <MobileNav links={links} userProfile={userProfile} isOpen={isOpen} onToggle={toggleMenu} />

      </div>
    </div>
  )
}
