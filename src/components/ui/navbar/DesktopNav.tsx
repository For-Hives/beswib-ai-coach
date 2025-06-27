import * as React from "react";
import { motion } from "framer-motion";
import { Bell, User, Settings, CreditCard, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

type Link = {
  label: string;
  href: string;
};

type UserProfile = {
  avatar: string;
  initial: string;
};

type DesktopNavProps = {
  links: Link[];
  userProfile: UserProfile;
  onLogout: () => void;
};

export const DesktopNav = ({ links, userProfile, onLogout }: DesktopNavProps) => {
  const router = useRouter();

  return (
    <>
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
      <motion.div
        className="hidden md:flex items-center gap-4 ml-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-gray-900" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover cursor-pointer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-base cursor-pointer">
                <span>{userProfile.initial}</span>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="px-4 py-2 text-sm text-gray-500">Mon Compte</div>
            <div className="border-t border-gray-100 my-1" />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/profile/card')}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Card</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/profile/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <div className="border-t border-gray-100 my-1" />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </>
  );
}; 