"use client";

import { SetStateAction, useState } from "react";
import { AtSign, User, Lock, Phone } from "lucide-react";
import Form from "@/components/ui/Form";
import ValidatedInput from "@/components/ui/ValidatedInput";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

const RegistrationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formValidation, setFormValidation] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
  });
  const [password, setPassword] = useState("");

  const isFormValid = Object.values(formValidation).every((isValid) => isValid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    //print data
    const form = e.target as HTMLFormElement;
    console.log("username: ", (form[0] as HTMLInputElement).value);
    console.log("email: ", (form[1] as HTMLInputElement).value);
    console.log("password: ", (form[2] as HTMLInputElement).value);
    console.log("confirmPassword: ", (form[3] as HTMLInputElement).value);
    console.log("phone: ", (form[4] as HTMLInputElement).value);

    // waiting to simulate apu call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    alert("Form submitted successfully!");
  };

  const handleValidChange = (field: keyof FormData) => (isValid: boolean) => {
    setFormValidation((prev) => ({
      ...prev,
      [field]: isValid,
    }));
  };

  return (
    <Form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 p-6">
      <div className="text-center">
        <Text variant="h1">Create Account</Text>
        <Text variant="small" color="gray">
          Please fill in your information to continue
        </Text>
      </div>

      <ValidatedInput
        label="Username"
        placeholder="Enter your username"
        startIcon={<User className="h-5 w-5" />}
        validation={{
          required: "Username is required",
          minLength: [3, "Username must be at least 3 characters"],
          pattern: [
            /^[a-zA-Z0-9_]+$/,
            "Only letters, numbers, and underscores allowed",
          ],
        }}
        onValidChange={handleValidChange("username")}
      />

      <ValidatedInput
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
        onValidChange={handleValidChange("email")}
      />

      <ValidatedInput
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
              message: "Must contain at least one special character (!@#$%^&*)",
            },
          ],
        }}
        onChange={(e: { target: { value: SetStateAction<string> } }) =>
          setPassword(e.target.value)
        }
        onValidChange={handleValidChange("password")}
      />

      <ValidatedInput
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
        onValidChange={handleValidChange("confirmPassword")}
      />

      <ValidatedInput
        label="Phone Number"
        placeholder="Enter your phone number"
        startIcon={<Phone className="h-5 w-5" />}
        validation={{
          pattern: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
        }}
        onValidChange={handleValidChange("phone")}
      />

      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        isLoading={isLoading}
        className="w-full"
      >
        Create Account
      </Button>

      <Text variant="small" color="gray" className="text-center">
        By creating an account, you agree to our Terms of Service and Privacy
        Policy
      </Text>
    </Form>
  );
};

export default RegistrationForm;
