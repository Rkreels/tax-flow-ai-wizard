
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SendHorizontal, Bot, User, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for chat messages
type MessageType = "ai" | "user";

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "ai",
    content: "👋 Hello! I'm your TaxFlow AI assistant. How can I help you with your taxes today?",
    timestamp: new Date(),
  },
];

const presetQuestions = [
  "What documents do I need for filing?",
  "Am I eligible for any tax credits?",
  "How do I report freelance income?",
  "What are the standard deduction amounts?",
];

const TaxAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock AI response function
  const getAIResponse = async (question: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Simple response logic based on question keywords
    if (question.toLowerCase().includes("document")) {
      return "For most tax returns, you'll need your W-2s from employers, any 1099 forms for other income, receipts for deductions, and last year's tax return. For specific situations like self-employment or rental income, additional documentation may be required.";
    } else if (question.toLowerCase().includes("credit")) {
      return "You may be eligible for various tax credits depending on your situation, such as the Earned Income Tax Credit (EITC), Child Tax Credit, American Opportunity Credit for education, or the Retirement Savings Contribution Credit. Would you like me to explain any of these in more detail?";
    } else if (question.toLowerCase().includes("freelance") || question.toLowerCase().includes("self-employ")) {
      return "Freelance income is reported on Schedule C (Form 1040). You'll need to report all income received and can deduct eligible business expenses. Don't forget to pay estimated quarterly taxes to avoid penalties. Would you like help with specific deductions for self-employment?";
    } else if (question.toLowerCase().includes("deduction")) {
      return "For 2023 tax returns, the standard deduction amounts are:\n• $13,850 for single filers\n• $27,700 for married filing jointly\n• $13,850 for married filing separately\n• $20,800 for heads of household\nThese amounts are higher if you're 65+ or blind.";
    } else {
      return "I'd be happy to help with your question about " + question.split(" ").slice(0, 3).join(" ") + "... Can you provide more specific details so I can give you a more accurate answer?";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Get AI response
      const aiResponse = await getAIResponse(input);
      
      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col h-full border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-taxBlue-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle>Tax Assistant</CardTitle>
                <CardDescription>Powered by AI to help with your tax questions</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center gap-1 px-2">
              <Sparkles className="h-3 w-3" />
              <span>Beta</span>
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] items-start space-x-2 rounded-lg px-3 py-2 ${
                    message.type === "user"
                      ? "bg-taxBlue-600 text-white"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] items-center space-x-2 rounded-lg bg-muted px-3 py-2">
                  <Bot className="h-4 w-4" />
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]"></div>
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <div className="px-4 py-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {presetQuestions.map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => handlePresetQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
        
        <CardFooter className="pt-0">
          <div className="flex w-full items-center space-x-2">
            <Input
              placeholder="Ask me anything about taxes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={loading}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!input.trim() || loading}
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TaxAssistant;
