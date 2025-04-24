
import React from 'react';
import { useVoiceAssistant } from '@/contexts/VoiceAssistantContext';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const VoiceAssistantToggle: React.FC = () => {
  const { isMuted, toggleMute } = useVoiceAssistant();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMute} 
            className="text-muted-foreground hover:text-foreground"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            <span className="sr-only">
              {isMuted ? 'Enable voice assistant' : 'Disable voice assistant'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isMuted ? 'Enable voice assistant' : 'Disable voice assistant'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VoiceAssistantToggle;
