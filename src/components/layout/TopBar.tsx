
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, Bell, Moon, Sun, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import { useNavigate } from "react-router-dom";
import VoiceAssistantToggle from "@/components/VoiceAssistantToggle";
import { useVoiceAssistant } from "@/contexts/VoiceAssistantContext";

interface TopBarProps {
  onMenuClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { speak } = useVoiceAssistant();
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleProfileClick = () => {
    speak("Opening your profile page where you can manage your personal information and settings.");
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    if (user?.role === "admin") {
      speak("Opening admin settings where you can manage system-wide configurations.");
      navigate("/settings");
    } else {
      speak("Opening your personal settings.");
      navigate("/profile");
    }
  };

  const handleLogout = () => {
    speak("Logging you out. Thank you for using TaxFlow AI.");
    logout();
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    speak(`Switched to ${newTheme} theme.`);
  };

  return (
    <header className="border-b bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center md:hidden">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          {/* Voice Assistant Toggle */}
          <VoiceAssistantToggle />
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => speak("Notifications feature coming soon.")}
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                    <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-xs text-muted-foreground">{user?.email}</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs bg-muted/50 text-muted-foreground">
                  Role: {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
