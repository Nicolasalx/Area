"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Hash,
  Link,
  Pencil,
  TextQuote,
  ThermometerSun,
} from "lucide-react";
import ValidatedInput from "@/components/ui/ValidatedInput";
import { ValidationRules } from "@/components/ui/useFormValidation";
import TimeInput from "@/components/ui/TimeInput";
import DateInput from "@/components/ui/DateInput";
import { InputType, InputField } from "@/app/workflows/types";

type DataFormData = Record<string, string>;

interface DataFormProps {
  title: string;
  fields: InputField[];
  onSubmit: (data: DataFormData) => void;
  onBack: () => void;
  prefix?: string;
}

export default function DataForm({
  title,
  fields,
  onSubmit,
  onBack,
  prefix = "",
}: DataFormProps) {
  const [formData, setFormData] = useState<DataFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getFieldKey = (field: InputField) => {
    return `${prefix}${field.field}`;
  };

  useEffect(() => {
    const initialData: DataFormData = {};
    fields.forEach((field) => {
      initialData[getFieldKey(field)] = "";
    });
    setFormData(initialData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, prefix]);

  const validateField = (field: InputField, value: string): string | null => {
    const rules = getValidationRules(field);

    if (rules.required && !value.trim()) {
      return `${field.field} is required`;
    }

    if (value.trim()) {
      if (rules.pattern) {
        if (!rules.pattern[0].test(value)) {
          return rules.pattern[1] || "Invalid format";
        }
      }

      if (rules.custom) {
        for (const rule of rules.custom) {
          if (!rule.validate(value)) {
            return rule.message;
          }
        }
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const key = getFieldKey(field);
      const error = validateField(field, formData[key] || "");
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submissionData: DataFormData = {};
      fields.forEach((field) => {
        const key = getFieldKey(field);
        submissionData[field.field] = formData[key] || "";
      });
      onSubmit(submissionData);
    }
  };

  const handleInputChange = (field: InputField, value: string) => {
    const key = getFieldKey(field);
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [key]: error || "",
    }));
  };

  const getValidationRules = (field: InputField): ValidationRules => {
    const rules: ValidationRules = {};

    if (field.required) {
      rules.required = true;
    }

    if (field.validation?.pattern) {
      rules.pattern = [new RegExp(field.validation.pattern), "Invalid format"];
    }

    if (field.type === "number") {
      rules.custom = [
        {
          validate: (value: string) => !isNaN(Number(value)),
          message: "Must be a valid number",
        },
      ];

      if (field.validation?.min !== undefined) {
        rules.custom.push({
          validate: (value: string) => Number(value) >= field.validation!.min!,
          message: `Must be at least ${field.validation.min}`,
        });
      }

      if (field.validation?.max !== undefined) {
        rules.custom.push({
          validate: (value: string) => Number(value) <= field.validation!.max!,
          message: `Must be at most ${field.validation.max}`,
        });
      }
    }

    if (field.type === "url") {
      rules.custom = [
        {
          validate: (value: string) => {
            try {
              new URL(value);
              return true;
            } catch {
              return false;
            }
          },
          message: "Must be a valid URL",
        },
      ];
    }
    return rules;
  };

  const getInputType = (field: InputField): string => {
    switch (field.type) {
      case "number":
        return "number";
      case "date":
        return "date";
      case "time":
        return "time";
      case "url":
        return "url";
      default:
        return "text";
    }
  };

  const determineInputType = (field: InputField): InputType => {
    if (
      field.field.toLowerCase().includes("url") ||
      field.description.toLowerCase().includes("url")
    ) {
      return "url";
    }
    if (field.field.toLowerCase().includes("date")) {
      return "date";
    }
    if (
      field.field.toLowerCase().includes("hour") ||
      field.field.toLowerCase().includes("time")
    ) {
      return "time";
    }
    if (
      field.field.toLowerCase().includes("temperature") ||
      field.field.toLowerCase().includes("threshold")
    ) {
      return "temperature";
    }
    if (field.field.toLowerCase().includes("channel")) {
      return "channel";
    }
    if (
      field.field.toLowerCase().includes("emoji") ||
      field.field.toLowerCase().includes("reaction")
    ) {
      return "emoji";
    }

    // Default to text if no special case matches
    return field.type || "text";
  };

  const getInputIcon = (type: InputType) => {
    switch (type) {
      case "url":
        return <Link className="h-4 w-4" />;
      case "date":
        return <Calendar className="h-4 w-4" />;
      case "time":
        return <Clock className="h-4 w-4" />;
      case "temperature":
        return <ThermometerSun className="h-4 w-4" />;
      case "channel":
        return <Hash className="h-4 w-4" />;
      case "emoji":
        return <TextQuote className="h-4 w-4" />;
      default:
        return <Pencil className="h-4 w-4" />;
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <Card.Header className="p-6">
        <Text variant="h3" className="text-xl font-medium">
          {title}
        </Text>
      </Card.Header>
      <Card.Body className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => {
            const key = getFieldKey(field);
            const displayName =
              field.field.charAt(0).toUpperCase() +
              field.field
                .slice(1)
                .replace(/([A-Z])/g, " $1")
                .trim();
            const inputType = determineInputType(field);

            return (
              <div key={key} className="space-y-1">
                {field.type === "select" && field.options ? (
                  <div>
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {displayName}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <select
                      id={key}
                      value={formData[key] || ""}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                    >
                      <option value="">
                        Select {displayName.toLowerCase()}
                      </option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : inputType === "time" ? (
                  <TimeInput
                    label={displayName}
                    required={field.required}
                    value={formData[key] || ""}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    error={errors[key]}
                    helperText={field.description}
                  />
                ) : inputType === "date" ? (
                  <DateInput
                    label={displayName}
                    required={field.required}
                    value={formData[key] || ""}
                    onChange={(date) => handleInputChange(field, date)}
                    error={errors[key]}
                    helperText={field.description}
                  />
                ) : (
                  <ValidatedInput
                    label={displayName}
                    required={field.required}
                    type={getInputType(field)}
                    placeholder={field.description}
                    value={formData[key] || ""}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    helperText={errors[key]}
                    validation={getValidationRules(field)}
                    startIcon={getInputIcon(inputType)}
                  />
                )}
              </div>
            );
          })}
          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              onClick={onBack}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-200"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
}
