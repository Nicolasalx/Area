"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ValidatedInput from "@/components/ui/ValidatedInput";

interface DataField {
  name: string;
  field?: string;
  description: string;
  required?: boolean;
  type?: string;
}

type DataFormData = Record<string, string>;

interface DataFormProps {
  title: string;
  fields: DataField[];
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

  const getFieldKey = (field: DataField) => {
    return `${prefix}${field.field || field.name}`;
  };

  useEffect(() => {
    const initialData: DataFormData = {};
    fields.forEach((field) => {
      initialData[getFieldKey(field)] = "";
    });
    setFormData(initialData);
  }, [fields, prefix]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const key = getFieldKey(field);
      if (field.required && !formData[key]?.trim()) {
        newErrors[key] = `${field.field || field.name} is required`;
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
        submissionData[field.field || field.name] = formData[key] || "";
      });
      onSubmit(submissionData);
    }
  };

  const handleInputChange = (field: DataField, value: string) => {
    const key = getFieldKey(field);
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
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
            const fieldName = field.field || field.name;
            const displayName =
              fieldName.charAt(0).toUpperCase() +
              fieldName
                .slice(1)
                .replace(/([A-Z])/g, " $1")
                .trim();

            return (
              <div key={key} className="space-y-1">
                <ValidatedInput
                  label={displayName}
                  required={field.required}
                  type={field.type || "text"}
                  placeholder={
                    field.description || `Enter ${displayName.toLowerCase()}`
                  }
                  value={formData[key] || ""}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
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
