
// VoiceAssistant.ts - Speech synthesis utility for TaxFlow AI

class VoiceAssistant {
  private synth: SpeechSynthesis;
  private isMuted: boolean = false;
  private voiceMessages: Record<string, string>;
  private pageDescriptions: Record<string, string>;
  private currentlySpeaking: boolean = false;
  private currentUser: any = null;

  constructor() {
    this.synth = window.speechSynthesis;
    
    // Voice messages for interactive elements
    this.voiceMessages = {
      // Dashboard buttons
      allReturnsBtn: "Navigating to All Returns page",
      usersBtn: "Opening Users Management page",
      taxRulesBtn: "Loading Tax Rules Configuration page",
      analyticsBtn: "Displaying Analytics Dashboard",
      settingsBtn: "Accessing System Settings",
      
      // System status
      authStatus: "Authentication Service: Operational. All user login and verification services are working properly.",
      taxEngineStatus: "Tax Calculation Engine: Operational. Tax calculations are being processed correctly.",
      docProcessingStatus: "Document Processing: Operational. Document uploads and processing are working as expected.",
      aiAssistantStatus: "AI Assistant: Degraded. Some advanced tax advice features may be limited.",
      
      // Navigation actions
      navDashboard: "Navigating to Dashboard. Here you'll find an overview of your tax activities.",
      navFiling: "Starting tax filing process. You can complete your tax return step by step.",
      navAssistant: "Opening AI tax assistant. Ask any tax-related questions for personalized guidance.",
      navReturns: "Viewing your tax returns. See the status of all your submitted and in-progress returns.",
      navProfile: "Accessing your profile. You can update your personal information and preferences.",
      navDocuments: "Managing your documents. Upload, organize, and access all your tax-related files.",
      navHelp: "Opening help center. Find answers to common questions and get support.",
      
      // General actions
      logout: "Logging out of your account. You'll need to sign in again to access your data.",
      uploadDocument: "Uploading document. Please select a file to upload to your tax documents.",
      downloadPdf: "Downloading PDF. Your tax document will be saved to your device.",
      saveChanges: "Saving your changes. Your updated information has been recorded.",
      cancelAction: "Cancelling action. No changes have been made to your information.",
      
      // Form interactions
      editProfile: "Opening profile editor. You can update your personal information and preferences.",
      resetPassword: "Password reset initiated. Check your email for reset instructions.",
      updatePermissions: "Updating user permissions. Changes will take effect immediately.",
      addNewUser: "Creating new user account. Fill in the required fields to proceed.",
      deleteUser: "User deletion confirmed. This action cannot be undone.",
      
      // Tax filing actions
      saveReturn: "Tax return saved successfully. You can continue editing later.",
      submitReturn: "Tax return submitted to IRS. You will receive confirmation within 24 hours.",
      printReturn: "Preparing tax return for printing. A new window will open with your document.",
      downloadReturn: "Downloading tax return PDF. The file will be saved to your device.",
      
      // Button interactions
      nextStep: "Proceeding to the next step in the tax filing process.",
      previousStep: "Going back to the previous step to review your information.",
      closeModal: "Closing dialog window. No changes have been saved.",
      confirmAction: "Action confirmed. Processing your request now."
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
    this.currentlySpeaking = true;
    utterance.onend = () => {
      this.currentlySpeaking = false;
    };
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

  public setUser(user: any): void {
    this.currentUser = user;
  }

  public getPersonalizedMessage(baseMessage: string): string {
    if (!this.currentUser) return baseMessage;
    
    const userName = this.currentUser.name ? this.currentUser.name.split(' ')[0] : '';
    const role = this.currentUser.role;
    
    // Add user-specific context based on role
    if (role === 'admin') {
      return `${userName}, as an administrator, ${baseMessage.toLowerCase()}`;
    } else if (role === 'accountant') {
      return `${userName}, as a tax professional, ${baseMessage.toLowerCase()}`;
    } else if (role === 'support') {
      return `${userName}, as a support agent, ${baseMessage.toLowerCase()}`;
    } else {
      return userName ? `${userName}, ${baseMessage.toLowerCase()}` : baseMessage;
    }
  }

  public toggle(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.synth.speaking) {
      this.synth.cancel();
      this.currentlySpeaking = false;
    } else if (!this.isMuted) {
      const message = this.getPersonalizedMessage("Voice assistant activated. I can guide you through using this tax application. Click on elements or navigate to pages for information.");
      this.speak(message);
    }
    return this.isMuted;
  }

  public isSpeaking(): boolean {
    return this.currentlySpeaking;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  public mute(): void {
    this.isMuted = true;
    if (this.synth.speaking) {
      this.synth.cancel();
      this.currentlySpeaking = false;
    }
  }

  public unmute(): void {
    this.isMuted = false;
    const message = this.getPersonalizedMessage("Voice assistant activated. I can guide you through using this tax application.");
    this.speak(message);
  }
}

// Create a singleton instance
const voiceAssistant = new VoiceAssistant();
export default voiceAssistant;
