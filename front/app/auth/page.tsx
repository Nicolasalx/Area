// app/auth/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm, RegisterForm } from "@/components/auth/AuthForms";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, UserPlus2 } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user && !isLoading) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  // Show nothing while checking authentication status
  if (isLoading) {
    return null;
  }

  // If user is authenticated, don't render the form (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md px-4 py-12">
        {/* <div className="mb-8 text-center">
          <Text variant="h1" className="mb-2">
            Welcome
          </Text>
          <Text color="gray">
            {isLogin
              ? "Sign in to your account to continue"
              : "Create a new account to get started"}
          </Text>
        </div> */}
        {isLogin ? <LoginForm /> : <RegisterForm />}
        <div className="mt-6 flex items-center justify-center gap-4 text-center">
          <Text variant="small" color="gray">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Text>
          <Button
            onClick={() => setIsLogin(!isLogin)}
            rightIcon={
              isLogin ? (
                <LogIn className="h-5 w-5" />
              ) : (
                <UserPlus2 className="h-5 w-5" />
              )
            }
          >
            {isLogin ? "Create an account" : "Sign in"}
          </Button>
        </div>
      </div>
    </div>
  );
}
