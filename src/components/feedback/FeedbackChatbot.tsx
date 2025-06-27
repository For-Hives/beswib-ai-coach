"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Bot } from 'lucide-react';
import apiClient from '@/lib/api';
import { SessionForFeedback } from '@/hooks/useSessionForFeedback';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    options?: string[];
}

interface UserAnswers {
    adherence: string | null;
    sensation: number | null;
    comment: string | null;
    pain: {
        hasPain: boolean | null;
        area: string | null;
    };
}

interface AdaptationResponse {
  success: boolean;
  suggestions: string[];
}

const steps = [
    { id: 'adherence', question: 'As-tu suivi la séance comme prévu ?', field: 'adherence', options: ['Oui, à la lettre', 'J\'ai un peu adapté', 'Pas du tout'] },
    { id: 'sensation', question: 'Comment t\'es-tu senti(e) ? (sur une échelle de 1 à 10)', field: 'sensation' },
    { id: 'pain', question: 'As-tu ressenti des douleurs ?', field: 'pain.hasPain', options: ['Non, aucune', 'Oui, une légère gêne', 'Oui, une douleur marquée'] },
    { id: 'painArea', question: 'Quelle zone était concernée ?', field: 'pain.area', isConditional: true },
    { id: 'comment', question: 'Un dernier commentaire à partager ? (facultatif)', field: 'comment' },
    { id: 'end', question: 'Merci pour tes retours ! Je vais analyser ça pour ajuster ton plan si besoin. Bonne récupération !' }
];

interface FeedbackChatbotProps {
  onClose: () => void;
  session?: SessionForFeedback;
}

export const FeedbackChatbot: React.FC<FeedbackChatbotProps> = ({ onClose, session }) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({ adherence: null, sensation: null, comment: null, pain: { hasPain: null, area: null } });
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const initialMessageDisplayed = useRef(false);

  useEffect(() => {
    if (initialMessageDisplayed.current) return;
    initialMessageDisplayed.current = true;

    if (session) {
      const plannedDate = format(parseISO(session.planned.date), "EEEE d MMMM", { locale: fr });
      setMessages([{
        id: 'initial',
        sender: 'bot',
        text: `Salut ! Prêt(e) à faire le point sur ta séance "${session.planned.title}" de ${plannedDate} ?`,
        options: ["Oui, c'est parti !", "Pas maintenant"],
      }]);
      setCurrentStep(0);
    } else {
      setMessages([{
        id: 'initial_no_session',
        sender: 'bot',
        text: "Salut ! Je suis ton coach AI. Pour l'instant, il n'y a pas de nouvelle séance à analyser. Je te contacterai dès que ce sera le cas !",
      }]);
    }
  }, [session]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);


  const handleUserResponse = async (text: string, value?: any) => {
    if (!session) {
        if (text === "Pas maintenant") onClose();
        return;
    }

    setMessages(prev => [...prev, { id: String(Date.now()), sender: 'user', text }]);
    setIsTyping(true);

    if (currentStep === 0) {
        if (text === "Pas maintenant") {
            onClose();
            return;
        }
        setCurrentStep(1); 
        setTimeout(() => {
            setMessages(prev => [...prev, { id: 'adherence_q', sender: 'bot', text: steps[0].question, options: steps[0].options }]);
            setIsTyping(false);
        }, 1000);
        return;
    }

    const step = steps[currentStep-1];
    let newAnswers = { ...userAnswers };

    if (step.field === 'adherence') newAnswers.adherence = value || text;
    if (step.field === 'sensation') newAnswers.sensation = parseInt(value || text, 10);
    if (step.field === 'pain.hasPain') newAnswers.pain.hasPain = value;
    if (step.field === 'pain.area') newAnswers.pain.area = value || text;
    if (step.field === 'comment') newAnswers.comment = value || text;
    
    setUserAnswers(newAnswers);

    let nextStepIndex = currentStep;
    if (step.id === 'pain' && !newAnswers.pain.hasPain) {
        nextStepIndex++;
    }
    
    nextStepIndex++;

    if (nextStepIndex > steps.length -1) {
        await handleSaveFeedback(newAnswers);
    } else {
        const nextStep = steps[nextStepIndex-1];
         setTimeout(() => {
            setMessages(prev => [...prev, { id: nextStep.id, sender: 'bot', text: nextStep.question, options: nextStep.options }]);
            setIsTyping(false);
        }, 1000);
    }
     setCurrentStep(nextStepIndex);
  };


  const handleSaveFeedback = async (finalAnswers: UserAnswers) => {
    if (!session || !token) return;

    const payload = {
      ...finalAnswers,
      sessionId: String(session.realized.id),
      sessionDate: session.planned.date,
      sessionTitle: session.planned.title,
      plannedVsRealized: {
        planned: {
          duration_min: session.planned.duration_min,
          distance_km: session.planned.distance_km || null,
        },
        realized: {
          duration_min: Math.round(session.realized.moving_time / 60),
          distance_km: parseFloat((session.realized.distance / 1000).toFixed(2)),
        }
      }
    };

    try {
      await apiClient('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      setIsTyping(true);
      const adaptationResponse = await apiClient<AdaptationResponse>('/api/training/adapt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
      });
      
      const suggestionsText = adaptationResponse.suggestions.join('\n- ');
      const finalText = `Merci pour tes retours ! Voici quelques suggestions pour la suite :\n- ${suggestionsText}`;
      
      setMessages(prev => [...prev, { id: 'final_thanks', sender: 'bot', text: finalText }]);
      setIsTyping(false);
      setTimeout(onClose, 8000);

    } catch (error) {
      console.error('Failed to save feedback or get adaptation:', error);
      setMessages(prev => [...prev, { id: 'error_msg', sender: 'bot', text: "Oups, une erreur est survenue. Tes retours n'ont peut-être pas été enregistrés." }]);
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-8 z-50">
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="w-96 bg-white rounded-2xl shadow-xl border flex flex-col h-[70vh] max-h-[600px]"
        >
            <div className="p-4 flex items-center bg-gradient-to-r from-purple-600 to-blue-500 rounded-t-2xl text-white shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Bot size={28} />
                </div>
                <div>
                    <h3 className="font-bold">Beswib AI Coach</h3>
                    <p className="text-sm opacity-90">Débrief de ta séance</p>
                </div>
                <button onClick={onClose} className="ml-auto text-white/70 hover:text-white"><X size={20} /></button>
            </div>

            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0"><Bot size={20} className="text-gray-600"/></div>}
                            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
                                {msg.sender === 'bot' && msg.options && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {msg.options.map((option, i) => (
                                            <Button key={i} variant="outline" className="bg-white/80" onClick={() => handleUserResponse(option, option)}>{option}</Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isTyping && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0"><Bot size={20} className="text-gray-600"/></div>
                        <div className="p-3 rounded-2xl bg-gray-100 rounded-bl-none">
                            <div className="flex gap-1 items-center">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}/>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}/>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}/>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    </div>
  );
}; 