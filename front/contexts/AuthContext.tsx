"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./ToastContext";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = Cookies.get("auth-token");
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);
      setToken(token);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        showToast(data.message || "Login failed", "error");
        return;
      }

      const { token, user: userData } = data.data;

      Cookies.set("auth-token", token, { path: "/" });

      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setToken(token);
      setError(null);
      showToast("Login successful", "success");
      router.push("/workflows");
    } catch (err) {
      console.error("Login error:", err);
      const message =
        err instanceof Error ? err.message : "An error occurred during login";
      setError(message);
      showToast(message, "error");
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            username: name,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || "Registration failed";
        setError(errorMessage);
        showToast(errorMessage, "error");
        throw new Error(errorMessage);
      }

      showToast("Registration successful! Logging you in...", "success");
      await login(email, password);
    } catch (err) {
      console.error("Registration error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred during registration";
      setError(message);
      showToast(message, "error");
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);

      const popup = window.open(
        "/api/auth/google",
        "Google Login",
        "width=500,height=600,left=" +
          (window.screenX + (window.outerWidth - 500) / 2) +
          ",top=" +
          (window.screenY + (window.outerHeight - 600) / 2),
      );

      if (popup) {
        const result = await new Promise<User>((resolve, reject) => {
          const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "GOOGLE_LOGIN_SUCCESS") {
              window.removeEventListener("message", handleMessage);
              resolve(event.data.user);
            } else if (event.data?.type === "GOOGLE_LOGIN_ERROR") {
              window.removeEventListener("message", handleMessage);
              reject(new Error(event.data.error));
            }
          };

          window.addEventListener("message", handleMessage);

          // Clean up if the popup is closed
          const checkClosed = setInterval(() => {
            if (popup.closed) {
              clearInterval(checkClosed);
              window.removeEventListener("message", handleMessage);
              reject(new Error("Login window closed"));
            }
          }, 1000);
        });

        setUser(result);
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError(err instanceof Error ? err.message : "Google login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    setToken(null);
    setUser(null);
    setError(null);
    showToast("Successfully logged out", "info");
    router.push("/auth");
  };

  const contextValue = {
    user,
    token,
    login,
    register,
    loginWithGoogle,
    logout,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
