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
    planAdaptationRequested: boolean | null;
}

interface AdaptationResponse {
  success: boolean;
  suggestions: string[];
}

const steps = [
    { id: 'adherence', question: 'As-tu suivi la séance comme prévu ?', field: 'adherence', options: ['Oui, à la lettre', 'J\'ai un peu adapté', 'Pas du tout'] },
    { id: 'sensation', question: 'Comment t\'es-tu senti(e) ? (sur une échelle de 1 à 10)', field: 'sensation', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
    { id: 'pain', question: 'As-tu ressenti des douleurs ?', field: 'pain.hasPain', options: ['Non, aucune', 'Oui, une légère gêne', 'Oui, une douleur marquée'] },
    { id: 'painArea', question: 'Quelle zone était concernée ?', field: 'pain.area', isConditional: true },
    { id: 'comment', question: 'Un dernier commentaire à partager ? (facultatif)', field: 'comment' },
    { id: 'adapt', question: 'Merci pour ces infos. Veux-tu que j\'essaie d\'adapter ton plan pour la suite ?', field: 'planAdaptationRequested', options: ['Oui, volontiers !', 'Non, ça ira merci'] },
    { id: 'end', question: 'Merci pour tes retours ! Bonne récupération !' }
];

interface FeedbackChatbotProps {
  onClose: () => void;
  session?: SessionForFeedback;
}

export const FeedbackChatbot: React.FC<FeedbackChatbotProps> = ({ onClose, session }) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({ adherence: null, sensation: null, comment: null, pain: { hasPain: null, area: null }, planAdaptationRequested: null });
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const initialMessageDisplayed = useRef(false);

  useEffect(() => {
    if (initialMessageDisplayed.current) return;
    initialMessageDisplayed.current = true;

    if (session) {
      let initialMessage: ChatMessage;

      if (session.isUnplanned) {
        initialMessage = {
          id: 'initial_unplanned',
          sender: 'bot',
          text: `Salut ! J'ai vu que tu as fait une séance imprévue : "${session.realized.name}". Prêt(e) à me dire comment ça s'est passé ?`,
          options: ["Oui, allons-y", "Plus tard"],
        };
      } else {
        const plannedDate = format(parseISO(session.planned.date), "EEEE d MMMM", { locale: fr });
        initialMessage = {
          id: 'initial_planned',
          sender: 'bot',
          text: `Salut ! Prêt(e) à faire le point sur ta séance "${session.planned.title}" de ${plannedDate} ?`,
          options: ["Oui, c'est parti !", "Pas maintenant"],
        };
      }
      setMessages([initialMessage]);
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

  const handleTextInputSubmit = () => {
    const lastStep = currentStep > 0 ? steps[currentStep - 1] : null;
    if (lastStep?.id !== 'comment' && textInput.trim() === '') {
      return; // Ne pas soumettre de réponse vide pour les champs obligatoires
    }
    handleUserResponse(textInput);
    setTextInput('');
  };

  const handleUserResponse = async (text: string, value?: any) => {
    if (!session) {
        if (text === "Pas maintenant") onClose();
        return;
    }

    setMessages(prev => [...prev, { id: String(Date.now()), sender: 'user', text }]);
    setIsTyping(true);

    if (currentStep === 0) {
        if (text === "Pas maintenant" || text === "Plus tard") {
            onClose();
            return;
        }
        // Pour une séance imprévue, on saute directement à la question sur les sensations
        const firstStepIndex = session?.isUnplanned ? 1 : 0;
        setCurrentStep(firstStepIndex + 1); 

        setTimeout(() => {
            setMessages(prev => [...prev, { id: steps[firstStepIndex].id, sender: 'bot', text: steps[firstStepIndex].question, options: steps[firstStepIndex].options }]);
            setIsTyping(false);
        }, 1000);
        return;
    }

    const step = steps[currentStep-1];
    let newAnswers = { ...userAnswers };

    if (step.field === 'adherence') newAnswers.adherence = value || text;
    if (step.field === 'sensation') newAnswers.sensation = parseInt(value || text, 10);
    if (step.field === 'pain.hasPain') {
      newAnswers.pain.hasPain = value !== 'Non, aucune';
    }
    if (step.field === 'pain.area') newAnswers.pain.area = value || text;
    if (step.field === 'comment') newAnswers.comment = value || text;
    if (step.field === 'planAdaptationRequested') newAnswers.planAdaptationRequested = value === 'Oui, volontiers !';
    
    setUserAnswers(newAnswers);

    let nextStepIndex = currentStep;
    if (step.id === 'pain' && !newAnswers.pain.hasPain) {
      nextStepIndex++; // On saute la question sur la zone de douleur
    }
    
    nextStepIndex++;

    if (nextStepIndex > steps.length - 2 || step.id === 'adapt') { // We're at the end
        await handleSaveFeedback({ ...newAnswers, planAdaptationRequested: newAnswers.planAdaptationRequested ?? (value === 'Oui, volontiers !')});
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
    if (isSubmitting || !session || !token) return;
    setIsSubmitting(true);

    const payload = {
      sessionId: String(session.realized.id),
      sessionDate: session.planned.date,
      sessionTitle: session.planned.title,
      adherence: finalAnswers.adherence,
      sensation: finalAnswers.sensation,
      pain: {
        hasPain: finalAnswers.pain.hasPain,
        area: finalAnswers.pain.area,
      },
      comment: finalAnswers.comment,
      planAdaptationRequested: session.isUnplanned ? false : finalAnswers.planAdaptationRequested,
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

      if (finalAnswers.planAdaptationRequested && !session.isUnplanned) {
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
        const finalText = `Parfait, j'ai noté tout ça. Voici quelques suggestions pour la suite :\n- ${suggestionsText}`;
        
        setMessages(prev => [...prev, { id: 'final_thanks_adapted', sender: 'bot', text: finalText }]);
        setIsTyping(false);
        setTimeout(onClose, 8000);
      } else {
        setIsTyping(true);
        const finalText = "C'est noté ! Merci pour tes retours et bonne récupération.";
        setMessages(prev => [...prev, { id: 'final_thanks_no_adapt', sender: 'bot', text: finalText }]);
        setIsTyping(false);
        setTimeout(onClose, 5000);
      }

    } catch (error) {
      console.error('Failed to save feedback or get adaptation:', error);
      setMessages(prev => [...prev, { id: `error_${Date.now()}`, sender: 'bot', text: "Oups, une erreur est survenue. Tes retours n'ont peut-être pas été enregistrés." }]);
      setIsTyping(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const lastStep = currentStep > 0 ? steps[currentStep - 1] : null;
  const needsTextInput = lastStep && !lastStep.options && lastStep.id !== 'end';

  return (
    <div className="fixed bottom-24 right-8 z-50">
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className={`w-96 bg-white rounded-2xl shadow-xl border flex flex-col ${isMinimized ? 'h-auto' : 'h-[70vh] max-h-[600px]'}`}
            transition={{ duration: 0.3 }}
        >
            <div 
                className="p-4 flex items-center bg-gradient-to-r from-purple-600 to-blue-500 rounded-t-2xl text-white shrink-0 cursor-pointer"
                onClick={() => setIsMinimized(!isMinimized)}
            >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Bot size={28} />
                </div>
                <div>
                    <h3 className="font-bold">Beswib AI Coach</h3>
                    <p className="text-sm opacity-90">Débrief de ta séance</p>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Empêche le clic de se propager à l'en-tête
                        onClose();
                    }} 
                    className="ml-auto text-white/70 hover:text-white"
                >
                    <X size={20} />
                </button>
            </div>

            <AnimatePresence>
                {!isMinimized && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex-grow flex flex-col overflow-hidden"
                    >
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
                        {needsTextInput && (
                            <div className="p-4 border-t bg-white">
                                <form onSubmit={(e) => { e.preventDefault(); handleTextInputSubmit(); }}>
                                    <div className="flex items-center gap-2">
                                        <Textarea
                                            placeholder="Écrivez votre réponse..."
                                            className="h-10 resize-none"
                                            value={textInput}
                                            onChange={(e) => setTextInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleTextInputSubmit();
                                                }
                                            }}
                                        />
                                        <Button type="submit">Envoyer</Button>
                                    </div>
                                    {lastStep.id === 'comment' && (
                                        <Button variant="ghost" className="mt-2 text-xs" onClick={() => handleUserResponse('')}>
                                            Passer cette étape
                                        </Button>
                                    )}
                                </form>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    </div>
  );
}; 