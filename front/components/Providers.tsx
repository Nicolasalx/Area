"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
};

export default Providers;
