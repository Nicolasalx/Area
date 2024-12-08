"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import ServiceList from "./components/ServiceList";
import TriggerList from "./components/TriggerList";
import ReactionList from "./components/ReactionList";
import NameForm from "./components/NameForm";
import ProgressIndicator from "./components/ProgressIndicator";

interface Service {
  id: number;
  name: string;
  description: string;
}

interface Action {
  id: number;
  name: string;
  description: string;
  serviceId: number;
  service?: Service;
}

interface Reaction {
  id: number;
  name: string;
  description: string;
  serviceId: number;
  service?: Service;
}

type Step =
  | "trigger-service"
  | "trigger"
  | "reaction-service"
  | "reaction"
  | "name";

export default function NewWorkflowPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableActions, setAvailableActions] = useState<Action[]>([]);
  const [availableReactions, setAvailableReactions] = useState<Reaction[]>([]);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(
    null,
  );
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>("trigger-service");

  const serviceMap = new Map<number, Service>();
  const actionsByService = new Map<number, Action[]>();
  const reactionsByService = new Map<number, Reaction[]>();

  availableActions.forEach((action) => {
    if (action.service) {
      serviceMap.set(action.service.id, action.service);
      const serviceActions = actionsByService.get(action.service.id) || [];
      serviceActions.push(action);
      actionsByService.set(action.service.id, serviceActions);
    }
  });

  availableReactions.forEach((reaction) => {
    if (reaction.service) {
      serviceMap.set(reaction.service.id, reaction.service);
      const serviceReactions =
        reactionsByService.get(reaction.service.id) || [];
      serviceReactions.push(reaction);
      reactionsByService.set(reaction.service.id, serviceReactions);
    }
  });

  useEffect(() => {
    const fetchServices = async () => {
      if (!token) return;

      try {
        const actionsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/actions`,
          {
            headers: {
              Authorization: token,
            },
          },
        );
        if (!actionsResponse.ok) throw new Error("Failed to fetch actions");
        const actionsData = await actionsResponse.json();
        console.log("Actions:", actionsData);
        setAvailableActions(actionsData);

        const reactionsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/reactions`,
          {
            headers: {
              Authorization: token,
            },
          },
        );
        if (!reactionsResponse.ok) throw new Error("Failed to fetch reactions");
        const reactionsData = await reactionsResponse.json();
        console.log("Reactions:", reactionsData);
        setAvailableReactions(reactionsData);
      } catch (error) {
        console.error("Error fetching services:", error);
        showToast("Failed to load available services", "error");
      }
    };

    fetchServices();
  }, [token, showToast]);

  const handleNext = () => {
    switch (currentStep) {
      case "trigger-service":
        if (selectedService) {
          setCurrentStep("trigger");
        }
        break;
      case "trigger":
        if (selectedAction) {
          setSelectedService(null);
          setCurrentStep("reaction-service");
        }
        break;
      case "reaction-service":
        if (selectedService) {
          setCurrentStep("reaction");
        }
        break;
      case "reaction":
        if (selectedReaction) {
          setCurrentStep("name");
        }
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "trigger":
        setSelectedAction(null);
        setCurrentStep("trigger-service");
        break;
      case "reaction-service":
        setCurrentStep("trigger");
        break;
      case "reaction":
        setSelectedReaction(null);
        setCurrentStep("reaction-service");
        break;
      case "name":
        setCurrentStep("reaction");
        break;
      default:
        router.back();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "trigger-service":
        return "Select a Service for the Action";
      case "trigger":
        return `Select an Action from ${selectedService?.name}`;
      case "reaction-service":
        return "Select a Service for the Reaction";
      case "reaction":
        return `Select a Reaction from ${selectedService?.name}`;
      case "name":
        return "Name Your Area";
    }
  };

  const getProgressStep = () => {
    switch (currentStep) {
      case "trigger-service":
      case "trigger":
        return "trigger";
      case "reaction-service":
      case "reaction":
        return "reaction";
      case "name":
        return "name";
    }
  };

  const handleSubmit = async () => {
    if (!user?.id || !token) return;

    if (!name.trim()) {
      showToast("Please enter a name for your workflow", "error");
      return;
    }

    if (!selectedAction) {
      showToast("Please select a action", "error");
      return;
    }

    if (!selectedReaction) {
      showToast("Please select a reaction", "error");
      return;
    }

    if (!selectedAction.service?.id || !selectedReaction.service?.id) {
      showToast("Invalid service selection", "error");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        sessionId: user.id,
        actions: [
          {
            id: selectedAction.id,
            name: selectedAction.name,
            serviceId: selectedAction.service.id,
          },
        ],
        reactions: [
          {
            id: selectedReaction.id,
            name: selectedReaction.name,
            serviceId: selectedReaction.service.id,
          },
        ],
      };

      console.log("Creating workflow with payload:", payload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/workflow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Workflow creation failed:", {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
        });
        throw new Error(
          `Failed to create workflow: ${response.status} ${response.statusText}\n${errorData}`,
        );
      }

      const data = await response.json();
      console.log("Workflow created successfully:", data);

      showToast("Workflow created successfully", "success");
      router.push("/workflows");
    } catch (error) {
      console.error("Create error:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to create workflow",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const progressSteps = [
    { key: "trigger", label: "Action" },
    { key: "reaction", label: "Reaction" },
    { key: "name", label: "Name" },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-gray-50">
      <div className="container mx-auto flex-none p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Text variant="h2" className="mb-2">
              Create New Area
            </Text>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator
            steps={progressSteps}
            currentStep={getProgressStep()}
            activeColor="black"
            inactiveColor="gray-300"
          />
        </div>

        <Text variant="h3">{getStepTitle()}</Text>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          {currentStep === "trigger-service" && (
            <ServiceList
              services={Array.from(serviceMap.values()).filter(
                (service) => actionsByService.get(service.id)?.length ?? 0 > 0,
              )}
              selectedService={selectedService}
              onSelect={setSelectedService}
              forTrigger={true}
              actionsByService={actionsByService}
            />
          )}

          {currentStep === "trigger" && selectedService && (
            <TriggerList
              triggers={actionsByService.get(selectedService.id) || []}
              selectedTrigger={selectedAction}
              onSelect={setSelectedAction}
            />
          )}

          {currentStep === "reaction-service" && (
            <ServiceList
              services={Array.from(serviceMap.values()).filter(
                (service) =>
                  reactionsByService.get(service.id)?.length ?? 0 > 0,
              )}
              selectedService={selectedService}
              onSelect={setSelectedService}
              forTrigger={false}
              reactionsByService={reactionsByService}
            />
          )}

          {currentStep === "reaction" && selectedService && (
            <ReactionList
              reactions={reactionsByService.get(selectedService.id) || []}
              selectedReaction={selectedReaction}
              onSelect={setSelectedReaction}
            />
          )}

          {currentStep === "name" && (
            <NameForm
              name={name}
              onNameChange={setName}
              selectedAction={selectedAction}
              selectedReaction={selectedReaction}
            />
          )}
        </div>
      </div>

      {/* Navigation - Fixed at bottom */}
      <div className="flex-none border-t border-gray-100 bg-white p-4">
        <div className="container mx-auto flex items-center justify-between px-8">
          <Button
            onClick={handleBack}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {currentStep !== "name" ? (
            <Button
              onClick={handleNext}
              disabled={
                currentStep === "trigger-service" ||
                currentStep === "reaction-service"
                  ? !selectedService
                  : currentStep === "trigger"
                    ? !selectedAction
                    : currentStep === "reaction"
                      ? !selectedReaction
                      : false
              }
              className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-200"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !name.trim()}
              className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-200"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  Create Area
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
