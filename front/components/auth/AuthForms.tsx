"use client";

import Image from "next/image";
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <Text variant="h2">Welcome</Text>
          <Text variant="small" color="gray">
            Sign in to your account
          </Text>
        </div>

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
          className="w-full border-2 bg-white"
          leftIcon={
            <Image
              src="/google-logo.svg"
              alt="Google"
              width={-1}
              height={-1}
              className="mr-2 h-5 w-5"
            />
          }
        >
          <Text>Sign in with Google</Text>
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <Text variant="h2">Create Account</Text>
          <Text variant="small" color="gray">
            Sign up for a new account
          </Text>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <Text color="red">{error}</Text>
            </div>
          </div>
        )}

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
            setFormValidation((prev) => ({ ...prev, confirmPassword: isValid }))
          }
        />

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
