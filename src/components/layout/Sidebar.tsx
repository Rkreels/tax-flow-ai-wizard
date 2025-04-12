
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  Upload,
  MessageSquare,
  User,
  Users,
  Settings,
  BarChart2,
  HelpCircle,
  LogOut,
} from "lucide-react";

// Define navigation items by role
const navigationByRole: Record<UserRole, { name: string; href: string; icon: React.ElementType; permission?: string }[]> = {
  user: [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "My Returns", href: "/returns", icon: FileText, permission: "view_own_returns" },
    { name: "New Tax Filing", href: "/filing", icon: Upload, permission: "edit_own_returns" },
    { name: "Tax Assistant", href: "/assistant", icon: MessageSquare, permission: "use_ai_assistant" },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Help", href: "/help", icon: HelpCircle },
  ],
  admin: [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "All Returns", href: "/returns", icon: FileText, permission: "view_all_returns" },
    { name: "Users", href: "/users", icon: Users, permission: "manage_users" },
    { name: "Tax Rules", href: "/tax-rules", icon: FileText, permission: "manage_tax_rules" },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Settings", href: "/settings", icon: Settings, permission: "system_settings" },
  ],
  support: [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "User Returns", href: "/returns", icon: FileText, permission: "view_user_status" },
    { name: "User Requests", href: "/requests", icon: Users, permission: "answer_questions" },
    { name: "Knowledge Base", href: "/knowledge", icon: FileText },
  ],
  accountant: [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Client Returns", href: "/returns", icon: FileText, permission: "view_assigned_returns" },
    { name: "New Tax Filing", href: "/filing", icon: Upload, permission: "edit_assigned_returns" },
    { name: "Documents", href: "/documents", icon: Upload },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
  ],
};

const Sidebar: React.FC = () => {
  const { user, logout, hasPermission } = useAuth();

  if (!user) {
    return null;
  }

  const navigation = navigationByRole[user.role] || [];

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r bg-white dark:bg-gray-900 dark:border-gray-800 md:flex md:flex-col">
      <div className="flex h-16 items-center justify-center border-b px-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full tax-gradient-bg"></div>
          <span className="text-lg font-bold">TaxFlow AI</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            // Skip rendering items that require permissions the user doesn't have
            if (item.permission && !hasPermission(item.permission)) {
              return null;
            }
            
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-taxBlue-50 text-taxBlue-700 dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive
                          ? "text-taxBlue-500 dark:text-white"
                          : "text-gray-400 dark:text-gray-400"
                      )}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-4 dark:border-gray-800">
        <button
          onClick={logout}
          className="group flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
