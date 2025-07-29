
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import voiceAssistant from '@/utils/VoiceAssistant';
import { useAuth } from '@/contexts/AuthContext';
import { Volume2, VolumeX } from "lucide-react";

interface VoiceAssistantContextType {
  isMuted: boolean;
  isSpeaking: boolean;
  toggleMute: () => void;
  speak: (text: string) => void;
  speakElementMessage: (elementId: string) => void;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextType | undefined>(undefined);

export const VoiceAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(voiceAssistant.getMutedState());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const location = useLocation();
  const { user } = useAuth();
  
  // Set user context for personalized voice messages
  useEffect(() => {
    if (user) {
      voiceAssistant.setUser(user);
    }
  }, [user]);

  // Update speaking state
  useEffect(() => {
    const checkSpeakingStatus = () => {
      setIsSpeaking(voiceAssistant.isSpeaking());
    };
    
    const interval = setInterval(checkSpeakingStatus, 200);
    return () => clearInterval(interval);
  }, []);
  
  // Speak page descriptions when route changes
  useEffect(() => {
    const path = location.pathname;
    let pageName: string;
    
    if (path === '/') pageName = 'dashboard';
    else if (path === '/filing') pageName = 'filing';
    else if (path === '/assistant') pageName = 'assistant';
    else if (path === '/returns') pageName = 'returns';
    else if (path === '/profile') pageName = 'profile';
    else if (path === '/documents') pageName = 'documents';
    else if (path === '/help') pageName = 'help';
    else if (path === '/analytics') pageName = 'analytics';
    else if (path === '/tax-rules') pageName = 'taxRules';
    else if (path === '/users') pageName = 'users';
    else if (path === '/settings') pageName = 'settings';
    else if (path === '/requests') pageName = 'requests';
    else if (path === '/knowledge') pageName = 'knowledge';
    else if (path === '/unauthorized') pageName = 'unauthorized';
    else return;
    
    // Use setTimeout to allow the page to render before speaking
    setTimeout(() => {
      voiceAssistant.speakPageDescription(pageName as any);
    }, 300);
  }, [location]);
  
  const toggleMute = () => {
    const newMutedState = voiceAssistant.toggle();
    setIsMuted(newMutedState);
  };
  
  const speak = (text: string) => {
    voiceAssistant.speak(text);
  };
  
  const speakElementMessage = (elementId: string) => {
    voiceAssistant.speakElementMessage(elementId);
  };

  return (
    <VoiceAssistantContext.Provider value={{ 
      isMuted, 
      isSpeaking,
      toggleMute, 
      speak, 
      speakElementMessage 
    }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={toggleMute}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90 transition"
          aria-label={isMuted ? "Enable voice assistant" : "Disable voice assistant"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className={isSpeaking ? "animate-pulse" : ""} />}
        </button>
      </div>
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistant = () => {
  const context = useContext(VoiceAssistantContext);
  if (context === undefined) {
    throw new Error('useVoiceAssistant must be used within a VoiceAssistantProvider');
  }
  return context;
};
