
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";

const Unauthorized: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <Shield className="h-12 w-12" />
      </div>
      <h1 className="mb-2 text-3xl font-bold">Access Denied</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        You don't have permission to access this page. 
        {user?.role && (
          <span> Your current role is <strong>{user.role}</strong>, which doesn't have the required permissions.</span>
        )}
      </p>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <Button asChild>
          <Link to="/">Return to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/login">Sign in with Different Account</Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
