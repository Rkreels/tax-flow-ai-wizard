
import React from 'react';
import { useVoiceAssistant } from '@/contexts/VoiceAssistantContext';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const VoiceAssistantToggle: React.FC = () => {
  const { isMuted, isSpeaking, toggleMute } = useVoiceAssistant();
  
  const handleToggle = () => {
    toggleMute();
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleToggle}
            aria-label={isMuted ? 'Enable voice assistant' : 'Disable voice assistant'}
            className="text-muted-foreground hover:text-foreground relative"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className={`h-5 w-5 ${isSpeaking ? "animate-pulse" : ""}`} />
            )}
            {isSpeaking && !isMuted && (
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{isMuted ? 'Enable voice assistant for spoken guidance' : 'Disable voice assistant'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VoiceAssistantToggle;
