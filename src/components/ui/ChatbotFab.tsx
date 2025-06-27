"use client";

import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Button } from './button';

interface ChatbotFabProps {
  onClick: () => void;
}

export const ChatbotFab: React.FC<ChatbotFabProps> = ({ onClick }) => {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <Button
        size="icon"
        className="rounded-full w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-500 text-white shadow-lg flex items-center justify-center"
        onClick={onClick}
      >
        <MessageSquare size={28} />
      </Button>
    </motion.div>
  );
}; 