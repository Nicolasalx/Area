"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm, RegisterForm } from "@/components/auth/AuthForms";
import Text from "@/components/ui/Text";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    if (user && !loading) {
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get("redirect");
      router.replace(redirectPath || "/workflows");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const toastType = searchParams.get("toast");
    if (toastType === "auth-required") {
      showToast("Please sign in to access this page", "info");
      const newParams = new URLSearchParams(window.location.search);
      newParams.delete("toast");
      const newUrl =
        window.location.pathname +
        (newParams.toString() ? `?${newParams.toString()}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, showToast]);

  if (loading) {
    return null;
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <div className="mt-6 flex items-center justify-center gap-4 text-center">
        <Text variant="small" color="gray">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </Text>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="rounded-sm text-sm text-black underline decoration-1 underline-offset-2 duration-200 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          {isLogin ? "Create an account" : "Sign in"}
        </button>
      </div>
    </div>
  );
}
