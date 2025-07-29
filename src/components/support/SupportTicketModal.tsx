import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVoiceAssistant } from '@/contexts/VoiceAssistantContext';
import { toast } from 'sonner';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  clientName: string;
  createdAt: string;
  category: string;
}

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
  onSave?: (ticket: SupportTicket) => void;
}

const SupportTicketModal: React.FC<SupportTicketModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onSave
}) => {
  const { speak } = useVoiceAssistant();
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState(ticket?.status || 'open');

  const handleSaveResponse = () => {
    if (!response.trim()) {
      speak("Please enter a response before saving.");
      toast.error("Response cannot be empty");
      return;
    }

    speak("Saving response to support ticket.");
    
    if (onSave && ticket) {
      const updatedTicket = {
        ...ticket,
        status: newStatus as SupportTicket['status']
      };
      onSave(updatedTicket);
    }

    toast.success("Response saved successfully");
    speak("Your response has been saved and the client will be notified.");
    setResponse('');
    onClose();
  };

  const handleStatusChange = (status: string) => {
    setNewStatus(status as SupportTicket['status']);
    speak(`Status changed to ${status}.`);
  };

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{ticket.title}</DialogTitle>
          <DialogDescription>
            Ticket #{ticket.id} - {ticket.clientName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Priority:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {ticket.priority.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="font-medium">Category:</span>
              <span className="ml-2">{ticket.category}</span>
            </div>
            <div>
              <span className="font-medium">Created:</span>
              <span className="ml-2">{ticket.createdAt}</span>
            </div>
            <div>
              <span className="font-medium">Current Status:</span>
              <span className="ml-2 capitalize">{ticket.status.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Issue Description</Label>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">{ticket.description}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Update Status</Label>
            <Select value={newStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="response">Response</Label>
            <Textarea
              id="response"
              placeholder="Enter your response to the client..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="min-h-24"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveResponse}>
            Save Response
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupportTicketModal;