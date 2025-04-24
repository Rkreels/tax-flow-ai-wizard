
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
      dashboard: "Welcome to your TaxFlow AI Dashboard. Here you can monitor your tax filing progress, view system status, and access key features. The top section displays your recent activity and filing deadlines. Below, you'll find quick access buttons for common tasks and a system health monitor displaying the status of critical services.",
      
      filing: "Welcome to the Tax Filing Wizard. This comprehensive step-by-step process will guide you through completing your tax return. You'll start with personal information, then move through income sources, deductions, and credits. Each section includes helpful tooltips and AI assistance to ensure accuracy.",
      
      assistant: "You're now in the AI Tax Assistant section. Think of me as your personal tax expert, available 24/7. You can ask questions about tax regulations, get help with specific deductions, or receive guidance on complex filing scenarios. Feel free to type your question or use voice commands.",
      
      returns: "You're in the Tax Returns Management section. Here you can view all your tax returns, both completed and in progress. Each return card shows the status, filing year, and type. Use the action buttons to view details, continue filing, or download completed returns. The top section includes filters to help you find specific returns.",
      
      profile: "This is your Profile Management page. Here you can update your personal information, including contact details and filing preferences. The security section allows you to manage your password and two-factor authentication. You can also customize your notification preferences and communication settings.",
      
      documents: "Welcome to your Document Management Center. This organized space lets you upload, store, and categorize all your tax-related documents. Use the folder structure to separate documents by year or type. The search function helps you quickly locate specific documents, and you can preview files before downloading.",
      
      help: "You've reached the Help Center. Browse through our comprehensive FAQ section, watch tutorial videos, or access detailed guides about tax filing processes. If you need personalized assistance, you can initiate a chat with our support team or schedule a consultation with a tax expert.",
      
      analytics: "The Analytics Dashboard provides detailed insights into your tax data and filing patterns. View historical comparisons, track deduction categories, and analyze your financial trends. Interactive charts help visualize your tax situation and identify potential savings opportunities.",
      
      taxRules: "You're in the Tax Rules Configuration section. Here you can review current tax rates, deduction limits, and credit eligibility criteria. The interface organizes rules by category and jurisdiction, making it easy to understand how different regulations affect your tax situation.",
      
      users: "Welcome to User Management. This section allows administrators to manage user accounts, assign roles, and set permissions. You can view active users, pending invitations, and recent activity logs. Use the filters to sort users by role or status.",
      
      settings: "You're in the System Settings. This control center lets you customize your TaxFlow AI experience. Adjust voice assistant preferences, configure notification settings, and manage integration options. Advanced users can access API configurations and data export settings.",
      
      requests: "The Support Requests dashboard shows all active and resolved support tickets. Each request includes its priority level, current status, and assigned support agent. You can track response times and add additional information to existing tickets.",
      
      knowledge: "Welcome to the Knowledge Base. This comprehensive resource contains detailed articles about tax regulations, filing procedures, and best practices. The content is regularly updated to reflect the latest tax law changes and includes practical examples.",
      
      unauthorized: "Access to this page is restricted. Based on your current role and permissions, you don't have authorization to view this content. Please contact your administrator if you believe this is an error, or return to the dashboard to access permitted features."
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

