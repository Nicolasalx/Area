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
  const { login, loginWithGoogle, loginWithGithub, error } = useAuth();
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
    <Card className="w-full max-w-md p-8 overflow-y-auto">
      <form onSubmit={handleSubmit}>
        <div className="text-center">
          <Text variant="h2">Welcome</Text>
          <Text variant="small" color="gray">
            Sign in to your account
          </Text>
        </div>
        <div className="space-y-2 my-4">
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
        <div className="space-y-4">
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            isLoading={isLoading}
            className="mt-2 w-full"
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

          <Button
            type="button"
            onClick={loginWithGithub}
            className="w-full bg-black hover:bg-gray-950"
            leftIcon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 1024 1024"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                  transform="scale(64)"
                  fill="#FFFFFF"
                />
              </svg>
            }
          >
            <Text color="white">Sign in with Github</Text>
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
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <Text color="red">{error}</Text>
            </div>
          </div>
        )}
        <div className="space-y-2 mb-4">
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
                  validate: (value: string) => /[A-Z]/.test(value),
                  message: "Must contain at least one uppercase letter",
                },
                {
                  validate: (value: string) => /[0-9]/.test(value),
                  message: "Must contain at least one number",
                },
                {
                  validate: (value: string) => /[!@#$%^&*]/.test(value),
                  message:
                    "Must contain at least one special character (!@#$%^&*)",
                },
              ],
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
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
                  validate: (value: string) => value === password,
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
          className="w-full"
        >
          <Text color="white">Create Account</Text>
        </Button>
      </form>
    </Card>
  );
};
