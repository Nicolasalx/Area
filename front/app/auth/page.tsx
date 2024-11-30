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

  if (isLoading) {
    return null;
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-md px-4 py-12">
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
