"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Bell } from "lucide-react"

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)

  // Récupération de l'email et de l'avatar (mock ou localStorage)
  let email = "";
  let avatar = "";
  if (typeof window !== "undefined") {
    try {
      // Essayons de récupérer depuis localStorage (clé 'profile' ou 'user')
      const userStr = localStorage.getItem("profile") || localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        email = user.email || "";
        avatar = user.avatar || "";
      }
    } catch {}
  }
  const initial = email ? email[0].toUpperCase() : "?";

  const toggleMenu = () => setIsOpen(!isOpen)

  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Mon plan d'entrainement", href: "/training" },
    { label: "Calendrier", href: "/calendar" },
    { label: "Profil", href: "/profile" },
    { label: "Coaches", href: "/coaches" },
  ];

  return (
    <div className="flex justify-center w-full py-6 px-4">
      <div className="flex items-center px-6 py-3 bg-white rounded-full shadow-lg w-full max-w-full relative z-10">
        {/* Logo à gauche */}
        <div className="flex items-center">
          <motion.div
            className="w-8 h-8 mr-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Logo Lucide */}
            <Menu className="w-8 h-8 text-orange-500" />
          </motion.div>
        </div>
        {/* Liens centrés */}
        <nav className="hidden md:flex flex-1 justify-center items-center space-x-8">
          {links.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <a href={item.href} className="text-sm text-gray-900 hover:text-gray-600 transition-colors font-medium">
                {item.label}
              </a>
            </motion.div>
          ))}
        </nav>
        {/* Actions à droite */}
        <motion.div
          className="hidden md:flex items-center gap-4 ml-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
            <Bell className="w-5 h-5 text-gray-900" />
          </button>
          {avatar ? (
            <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-base">
              <span>{initial}</span>
            </div>
          )}
        </motion.div>
        {/* Mobile Menu Button */}
        <motion.button className="md:hidden flex items-center" onClick={toggleMenu} whileTap={{ scale: 0.9 }}>
          <Menu className="h-6 w-6 text-gray-900" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 pt-24 px-6 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-gray-900" />
            </motion.button>
            <div className="flex flex-col space-y-6">
              {links.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <a href={item.href} className="text-base text-gray-900 font-medium" onClick={toggleMenu}>
                    {item.label}
                  </a>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6 flex gap-4 items-center"
              >
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                  <Bell className="w-5 h-5 text-gray-900" />
                </button>
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-base">
                    <span>{initial}</span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Navbar1 }
