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
import DataForm from "./components/DataForm";
import api from "@/lib/api";
import Loading from "./loading";
import { formatActionReactionName } from "../utils";
import { Action, Reaction, Service, WorkflowStep, WorkflowData } from "@/app/workflows/types";

export default function NewWorkflowPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [availableActions, setAvailableActions] = useState<Action[]>([]);
  const [availableReactions, setAvailableReactions] = useState<Reaction[]>([]);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("trigger-service");
  const [actionData, setActionData] = useState<Record<string, string>>({});
  const [reactionData, setReactionData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

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
      try {
        const [actionsResponse, reactionsResponse] = await Promise.all([
          api.get("/actions"),
          api.get("/reactions"),
        ]);

        console.log("Actions:", actionsResponse.data);
        setAvailableActions(actionsResponse.data);

        console.log("Reactions:", reactionsResponse.data);
        setAvailableReactions(reactionsResponse.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        showToast("Failed to load available services", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [showToast]);

  const handleBack = () => {
    switch (currentStep) {
      case "trigger":
        setCurrentStep("trigger-service");
        setSelectedAction(null);
        break;
      case "trigger-data":
        setCurrentStep("trigger");
        setActionData({});
        break;
      case "reaction-service":
        setCurrentStep("trigger-data");
        setSelectedService(null);
        break;
      case "reaction":
        setCurrentStep("reaction-service");
        setSelectedReaction(null);
        break;
      case "reaction-data":
        setCurrentStep("reaction");
        setReactionData({});
        break;
      case "name":
        setCurrentStep("reaction-data");
        setName("");
        break;
    }
  };

  const handleNext = () => {
    switch (currentStep) {
      case "trigger-service":
        setCurrentStep("trigger");
        break;
      case "trigger":
        setCurrentStep("trigger-data");
        break;
      case "trigger-data":
        setCurrentStep("reaction-service");
        setSelectedService(null);
        break;
      case "reaction-service":
        setCurrentStep("reaction");
        break;
      case "reaction":
        setCurrentStep("reaction-data");
        break;
      case "reaction-data":
        setCurrentStep("name");
        break;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "trigger-service":
        return "Select a Service for the Action";
      case "trigger":
        return `Select an Action from ${selectedService?.name}`;
      case "trigger-data":
        return `Configure ${formatActionReactionName(selectedAction?.name)} Action`;
      case "reaction-service":
        return "Select a Service for the Reaction";
      case "reaction":
        return `Select a Reaction from ${selectedService?.name}`;
      case "reaction-data":
        return `Configure ${formatActionReactionName(selectedReaction?.name)} Reaction`;
      case "name":
        return "Name Your Area";
    }
  };

  const getProgressStep = () => {
    switch (currentStep) {
      case "trigger-service":
      case "trigger":
      case "trigger-data":
        return "trigger";
      case "reaction-service":
      case "reaction":
      case "reaction-data":
        return "reaction";
      case "name":
        return "name";
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) return;

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

    setSubmitting(true);

    try {
      const payload = {
        name,
        sessionId: user.id,
        actions: [
          {
            name: selectedAction.name,
            serviceId: selectedAction.service.id,
            data: actionData,
            isActive: true,
          },
        ],
        reactions: [
          {
            name: selectedReaction.name,
            serviceId: selectedReaction.service.id,
            data: reactionData,
            isActive: true,
            trigger: { reaction: selectedReaction.name },
          },
        ],
      } satisfies WorkflowData;

      console.log("Creating workflow with payload:", payload);

      const response = await api.post("/workflow", payload);
      console.log("Workflow created successfully:", response.data);

      showToast("Workflow created successfully", "success");
      router.push("/workflows");
    } catch (error) {
      console.error("Create error:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to create workflow",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const progressSteps = [
    { key: "trigger", label: "Action" },
    { key: "reaction", label: "Reaction" },
    { key: "name", label: "Name" },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case "trigger-service":
        return (
          <ServiceList
            services={Array.from(serviceMap.values())}
            selectedService={selectedService}
            onSelect={setSelectedService}
            forTrigger={true}
            actionsByService={actionsByService}
          />
        );
      case "trigger":
        return (
          <TriggerList
            triggers={actionsByService.get(selectedService?.id ?? -1) ?? []}
            selectedTrigger={selectedAction}
            onSelect={setSelectedAction}
          />
        );
      case "trigger-data":
        return (
          <DataForm
            title={`Configure ${formatActionReactionName(selectedAction?.name)}`}
            fields={selectedAction?.body ?? []}
            prefix="action_"
            onSubmit={(data) => {
              setActionData(data);
              handleNext();
            }}
            onBack={handleBack}
          />
        );
      case "reaction-service":
        return (
          <ServiceList
            services={Array.from(serviceMap.values())}
            selectedService={selectedService}
            onSelect={setSelectedService}
            forTrigger={false}
            reactionsByService={reactionsByService}
          />
        );
      case "reaction":
        return (
          <ReactionList
            reactions={reactionsByService.get(selectedService?.id ?? -1) ?? []}
            selectedReaction={selectedReaction}
            onSelect={setSelectedReaction}
          />
        );
      case "reaction-data":
        return (
          <DataForm
            title={`Configure ${formatActionReactionName(selectedReaction?.name)}`}
            fields={selectedReaction?.body ?? []}
            prefix="reaction_"
            onSubmit={(data) => {
              setReactionData(data);
              handleNext();
            }}
            onBack={handleBack}
          />
        );
      case "name":
        return (
          <NameForm
            value={name}
            onChange={setName}
            selectedAction={selectedAction}
            selectedReaction={selectedReaction}
          />
        );
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      {/* Fixed Header */}
      <div className="mx-auto flex w-full p-2 py-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-4">
            <Text variant="h2">Create New Area</Text>
            <Text variant="h3">{getStepTitle()}</Text>
          </div>

          <ProgressIndicator
            steps={progressSteps}
            currentStep={getProgressStep()}
            activeColor="black"
            inactiveColor="gray-300"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-2">{renderStep()}</div>
      </div>

      {/* Fixed Footer */}
      <div className="w-full rounded-t-lg border border-gray-100 bg-white p-4 py-6 shadow-md duration-200">
        <div className="mx-auto flex w-full items-center justify-between">
          {currentStep !== "trigger-service" &&
          currentStep !== "trigger-data" &&
          currentStep !== "reaction-data" ? (
            <Button
              onClick={handleBack}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button
              onClick={() => {
                router.back();
              }}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}

          {currentStep !== "name" &&
          currentStep !== "trigger-data" &&
          currentStep !== "reaction-data" ? (
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
          ) : currentStep === "name" ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting || !name.trim()}
              className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-200"
            >
              {submitting ? (
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
          ) : null}
        </div>
      </div>
    </div>
  );
}
