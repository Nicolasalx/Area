"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ValidatedInput from "@/components/ui/ValidatedInput";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import { AtSign, Lock, User, AlertCircle } from "lucide-react";

type ValidationFields = {
  [key: string]: boolean;
};

export const LoginForm = () => {
  const { login, loginWithGoogle, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formValidation, setFormValidation] = useState<ValidationFields>({
    email: false,
    password: false,
  });

  const isFormValid = Object.values(formValidation).every((isValid) => isValid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      setIsLoading(true);
      await login(email, password);
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <form onSubmit={handleSubmit}>
        <div className="text-center">
          <Text variant="h2">Welcome</Text>
          <Text variant="small" color="gray">
            Sign in to your account
          </Text>
        </div>
        <div className="space-y-2">
          {error && (
            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <Text color="red">{error}</Text>
              </div>
            </div>
          )}

          <ValidatedInput
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            startIcon={<AtSign className="h-5 w-5" />}
            validation={{
              required: "Email is required",
              pattern: [
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                "Invalid email address",
              ],
            }}
            onValidChange={(isValid) =>
              setFormValidation((prev) => ({ ...prev, email: isValid }))
            }
          />

          <ValidatedInput
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            startIcon={<Lock className="h-5 w-5" />}
            validation={{
              required: "Password is required",
            }}
            onValidChange={(isValid) =>
              setFormValidation((prev) => ({ ...prev, password: isValid }))
            }
          />
        </div>

        <div className="mt-8 space-y-4">
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            isLoading={isLoading}
            className="w-full"
          >
            <Text color="white">Sign In</Text>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={loginWithGoogle}
            className="w-full border border-gray-300 bg-white hover:bg-gray-50"
            leftIcon={
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
            }
          >
            <Text>Sign in with Google</Text>
          </Button>
        </div>
      </form>
    </Card>
  );
};

export const RegisterForm = () => {
  const { register, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [formValidation, setFormValidation] = useState<ValidationFields>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const isFormValid = Object.values(formValidation).every((isValid) => isValid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;

    try {
      setIsLoading(true);
      await register(email, password, name);
    } catch (err) {
      console.error("Registration failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div className="text-center">
        <Text variant="h2">Create Account</Text>
        <Text variant="small" color="gray">
          Sign up for a new account
        </Text>
      </div>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <Text color="red">{error}</Text>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <ValidatedInput
            name="name"
            label="Full Name"
            placeholder="Enter your name"
            startIcon={<User className="h-5 w-5" />}
            validation={{
              required: "Name is required",
              minLength: [2, "Name must be at least 2 characters"],
            }}
            onValidChange={(isValid) =>
              setFormValidation((prev) => ({ ...prev, name: isValid }))
            }
          />

          <ValidatedInput
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            startIcon={<AtSign className="h-5 w-5" />}
            validation={{
              required: "Email is required",
              pattern: [
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                "Invalid email address",
              ],
            }}
            onValidChange={(isValid) =>
              setFormValidation((prev) => ({ ...prev, email: isValid }))
            }
          />

          <ValidatedInput
            name="password"
            label="Password"
            type="password"
            placeholder="Create a password"
            startIcon={<Lock className="h-5 w-5" />}
            validation={{
              required: "Password is required",
              minLength: [8, "Password must be at least 8 characters"],
              custom: [
                {
                  validate: (value) => /[A-Z]/.test(value),
                  message: "Must contain at least one uppercase letter",
                },
                {
                  validate: (value) => /[0-9]/.test(value),
                  message: "Must contain at least one number",
                },
                {
                  validate: (value) => /[!@#$%^&*]/.test(value),
                  message:
                    "Must contain at least one special character (!@#$%^&*)",
                },
              ],
            }}
            onChange={(e) => setPassword(e.target.value)}
            onValidChange={(isValid) =>
              setFormValidation((prev) => ({ ...prev, password: isValid }))
            }
          />

          <ValidatedInput
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            startIcon={<Lock className="h-5 w-5" />}
            validation={{
              required: "Please confirm your password",
              custom: [
                {
                  validate: (value) => value === password,
                  message: "Passwords do not match",
                },
              ],
            }}
            onValidChange={(isValid) =>
              setFormValidation((prev) => ({
                ...prev,
                confirmPassword: isValid,
              }))
            }
          />
        </div>

        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          isLoading={isLoading}
          className="mt-8 w-full"
        >
          <Text color="white">Create Account</Text>
        </Button>
      </form>
    </Card>
  );
};
