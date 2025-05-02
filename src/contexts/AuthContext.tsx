
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// Define user roles
export type UserRole = "user" | "admin" | "support" | "accountant";

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: "user1",
    email: "user@example.com",
    password: "password",
    name: "John Doe",
    role: "user" as UserRole,
    avatar: "/assets/avatars/user-avatar.png",
  },
  {
    id: "admin1",
    email: "admin@example.com",
    password: "password",
    name: "Admin User",
    role: "admin" as UserRole,
    avatar: "/assets/avatars/admin-avatar.png",
  },
  {
    id: "support1",
    email: "support@example.com",
    password: "password",
    name: "Support Agent",
    role: "support" as UserRole,
    avatar: "/assets/avatars/support-avatar.png",
  },
  {
    id: "accountant1",
    email: "accountant@example.com",
    password: "password",
    name: "Tax Professional",
    role: "accountant" as UserRole,
    avatar: "/assets/avatars/accountant-avatar.png",
  },
];

// Permission mapping based on roles - TurboTax style with strictly defined permissions
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  user: [
    "dashboard",
    "view_own_returns", 
    "edit_own_returns", 
    "upload_documents", 
    "use_ai_assistant",
    "view_profile",
    "view_help"
  ],
  admin: [
    "dashboard",
    "manage_users", 
    "manage_tax_rules", 
    "view_all_returns", 
    "edit_all_returns", 
    "system_settings", 
    "view_analytics"
  ],
  support: [
    "dashboard",
    "view_user_status", 
    "answer_questions", 
    "view_knowledge_base", 
    "view_help"
  ],
  accountant: [
    "dashboard",
    "view_assigned_returns", 
    "view_all_returns", // Added to ensure tax professionals can access returns
    "edit_assigned_returns",
    "edit_all_returns", // Added to ensure they can edit returns
    "provide_tax_advice", 
    "view_analytics", 
    "upload_documents",
    "view_clients" // Added for client access
  ],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check for stored user in localStorage (for demo purposes)
    const storedUser = localStorage.getItem("taxFlowUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("taxFlowUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user with matching email and password
    const matchedUser = MOCK_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (matchedUser) {
      // Convert to User object (without password)
      const { password: _, ...userWithoutPassword } = matchedUser;
      setUser(userWithoutPassword);
      localStorage.setItem("taxFlowUser", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}`,
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    if (MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      toast({
        title: "Signup failed",
        description: "Email already exists",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Create new user (in a real app, this would be an API call)
    const newUser: User = {
      id: `user${Date.now()}`,
      email,
      name,
      role: "user",
    };
    
    setUser(newUser);
    localStorage.setItem("taxFlowUser", JSON.stringify(newUser));
    
    toast({
      title: "Account created",
      description: "Your account has been created successfully",
    });
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("taxFlowUser");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
