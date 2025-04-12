
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DemoAccount {
  title: string;
  email: string;
  description: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);

  if (isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  const demoAccounts: DemoAccount[] = [
    {
      title: "Administrator",
      email: "admin@example.com",
      description: "Full system access"
    },
    {
      title: "Support Agent",
      email: "support@example.com",
      description: "Support module access"
    },
    {
      title: "Tax Professional",
      email: "accountant@example.com",
      description: "Tax filing assistance access"
    },
    {
      title: "Regular User",
      email: "user@example.com",
      description: "Basic tax filing access"
    }
  ];

  const handleLogin = async (email: string) => {
    setIsLoggingIn(email);
    try {
      // Using the standard password for all demo accounts
      await login(email, "password");
    } finally {
      setIsLoggingIn(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>

      <div className="container flex flex-col items-center justify-center px-4 py-8 md:h-screen lg:px-6">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[600px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="mx-auto h-12 w-12 rounded-full tax-gradient-bg"></div>
            <h1 className="text-2xl font-semibold tracking-tight">TaxFlow AI</h1>
            <p className="text-sm text-muted-foreground">
              The intelligent tax filing platform for everyone
            </p>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">Demo Accounts</CardTitle>
              <p className="text-gray-600">
                Click on any of the following accounts to sign in with different role permissions:
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4 pt-4">
              {demoAccounts.map((account, index) => (
                <Card key={index} className="overflow-hidden border shadow-sm hover:shadow">
                  <div className="flex items-center justify-between p-4">
                    <div className="space-y-1">
                      <h3 className="font-medium">{account.title}</h3>
                      <p className="text-sm text-gray-500">{account.email}</p>
                      <p className="text-xs text-gray-500">{account.description}</p>
                    </div>
                    <Button
                      onClick={() => handleLogin(account.email)}
                      disabled={isLoggingIn !== null}
                      className="min-w-20"
                    >
                      {isLoggingIn === account.email ? "Signing in..." : "Login"}
                    </Button>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>

          <div className="text-center text-xs text-gray-500">
            <p>Password for all accounts: <span className="font-mono">password</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
