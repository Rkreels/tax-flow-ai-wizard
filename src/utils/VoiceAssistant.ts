
// VoiceAssistant.ts - Speech synthesis utility for TaxFlow AI

class VoiceAssistant {
  private synth: SpeechSynthesis;
  private isMuted: boolean = false;
  private voiceMessages: Record<string, string>;
  private pageDescriptions: Record<string, string>;

  constructor() {
    this.synth = window.speechSynthesis;
    
    // Voice messages for interactive elements
    this.voiceMessages = {
      // Dashboard buttons
      allReturnsBtn: "Navigating to All Returns",
      usersBtn: "Opening Users Management",
      taxRulesBtn: "Loading Tax Rules Configuration",
      analyticsBtn: "Displaying Analytics Dashboard",
      settingsBtn: "Accessing System Settings",
      
      // System status
      authStatus: "Authentication Service: Operational",
      taxEngineStatus: "Tax Calculation Engine: Operational",
      docProcessingStatus: "Document Processing: Operational",
      aiAssistantStatus: "AI Assistant: Degraded",
      
      // Navigation actions
      navDashboard: "Navigating to Dashboard",
      navFiling: "Starting tax filing process",
      navAssistant: "Opening AI tax assistant",
      navReturns: "Viewing your tax returns",
      navProfile: "Accessing your profile",
      navDocuments: "Managing your documents",
      navHelp: "Opening help center",
      
      // General actions
      logout: "Logging out of your account",
      uploadDocument: "Uploading document",
      downloadPdf: "Downloading PDF",
      saveChanges: "Saving your changes",
      cancelAction: "Cancelling action"
    };
    
    // Page descriptions for when pages are loaded
    this.pageDescriptions = {
      dashboard: "Welcome to your TaxFlow AI Dashboard. Here you can see your filing progress, recent activity, and quick access to important features.",
      filing: "Welcome to the Tax Filing Wizard. This step-by-step process will guide you through completing your tax return.",
      assistant: "The AI Tax Assistant is ready to help. You can ask questions about tax rules, deductions, or get help filing your return.",
      returns: "Here you can view all your tax returns, their status, and download completed returns.",
      profile: "Your profile page allows you to update personal information, notification preferences, and security settings.",
      documents: "This is your document management center. Upload, organize, and access all tax-related documents here.",
      help: "The help center provides guides, FAQs, and options to contact support if you need assistance.",
      analytics: "The analytics dashboard provides insights into filing metrics, user behavior, and system performance.",
      taxRules: "Here you can view and manage all tax rules in the system, including rates, deductions, and credits.",
      users: "User management allows you to view and manage all users in the system.",
      settings: "System settings provide options to configure application behavior and preferences.",
      requests: "View and manage support requests from users.",
      knowledge: "Access the knowledge base of tax information and guidance.",
      unauthorized: "You don't have permission to access this page. Please contact your administrator if you believe this is an error."
    };
  }

  public speak(text: string): void {
    if (this.isMuted || !this.synth) return;
    
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Set a slightly slower rate for better clarity
    utterance.rate = 0.9;
    this.synth.speak(utterance);
  }

  public speakElementMessage(elementId: string): void {
    if (this.voiceMessages[elementId]) {
      this.speak(this.voiceMessages[elementId]);
    }
  }

  public speakPageDescription(pageName: keyof typeof this.pageDescriptions): void {
    if (this.pageDescriptions[pageName]) {
      this.speak(this.pageDescriptions[pageName]);
    }
  }

  public toggle(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.synth.speaking) {
      this.synth.cancel();
    } else if (!this.isMuted) {
      this.speak("Voice assistant activated");
    }
    return this.isMuted;
  }

  public isSpeaking(): boolean {
    return this.synth.speaking;
  }

  public mute(): void {
    this.isMuted = true;
    if (this.synth.speaking) {
      this.synth.cancel();
    }
  }

  public unmute(): void {
    this.isMuted = false;
    this.speak("Voice assistant activated");
  }
}

// Create a singleton instance
const voiceAssistant = new VoiceAssistant();
export default voiceAssistant;
