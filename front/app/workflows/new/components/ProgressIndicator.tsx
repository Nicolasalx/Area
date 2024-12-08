import Text from "@/components/ui/Text";
import { ReactElement } from "react";

interface Step {
  key: string;
  label: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: string;
  activeColor?: string;
  inactiveColor?: string;
}

export default function ProgressIndicator({
  steps,
  currentStep,
  activeColor = "blue-500",
  inactiveColor = "gray-200",
}: ProgressIndicatorProps): ReactElement {
  const isStepComplete = (stepKey: string) => {
    const stepOrder = steps.findIndex((s) => s.key === stepKey);
    const currentStepOrder = steps.findIndex((s) => s.key === currentStep);
    return currentStepOrder >= stepOrder;
  };

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center">
          <div className="flex flex-col items-center">
            <Text
              variant="caption"
              className={`mb-2 text-sm ${
                currentStep === step.key
                  ? `text-${activeColor}`
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </Text>
            <div
              className={`h-1 w-16 rounded-full transition-colors duration-300 ${
                isStepComplete(step.key)
                  ? `bg-${activeColor}`
                  : `bg-${inactiveColor}`
              }`}
            />
          </div>
          {index < steps.length - 1 && <div className="w-1" />}
        </div>
      ))}
    </div>
  );
}
