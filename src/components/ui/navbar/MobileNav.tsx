import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell } from "lucide-react";

type Link = {
  label: string;
  href: string;
};

type UserProfile = {
  avatar: string;
  initial: string;
};

type MobileNavProps = {
  links: Link[];
  userProfile: UserProfile;
  isOpen: boolean;
  onToggle: () => void;
};

export const MobileNav = ({ links, userProfile, isOpen, onToggle }: MobileNavProps) => {
  return (
    <>
      <motion.button className="md:hidden flex items-center" onClick={onToggle} whileTap={{ scale: 0.9 }}>
        <Menu className="h-6 w-6 text-gray-900" />
      </motion.button>
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
              onClick={onToggle}
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
                  <a href={item.href} className="text-base text-gray-900 font-medium" onClick={onToggle}>
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
                {userProfile.avatar ? (
                  <img src={userProfile.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-base">
                    <span>{userProfile.initial}</span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 