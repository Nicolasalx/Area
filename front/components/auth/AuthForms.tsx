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
  const { login, error } = useAuth();
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
        <div className="space-y-4">
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

        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          isLoading={isLoading}
          className="mt-6 w-full"
        >
          <Text color="white">Sign In</Text>
        </Button>
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
        <div className="space-y-4">
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
