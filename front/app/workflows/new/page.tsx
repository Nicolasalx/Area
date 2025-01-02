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
import {
  Action,
  Reaction,
  Service,
  WorkflowStep,
  WorkflowData,
} from "@/app/workflows/types";

export default function NewWorkflowPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [availableActions, setAvailableActions] = useState<Action[]>([]);
  const [availableReactions, setAvailableReactions] = useState<Reaction[]>([]);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(
    null,
  );
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentStep, setCurrentStep] =
    useState<WorkflowStep>("trigger-service");
  const [actionData, setActionData] = useState<Record<string, string>>({});
  const [reactionData, setReactionData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingActions, setLoadingActions] = useState(true);
  const [loadingReactions, setLoadingReactions] = useState(true);

  // Handle browser navigation
  useEffect(() => {
    const handlePopState = () => {
      switch (currentStep) {
        case "trigger-action":
          setCurrentStep("trigger-service");
          setSelectedAction(null);
          break;
        case "trigger-data":
          setCurrentStep("trigger-action");
          break;
        case "reaction-service":
          // If coming from reaction-service, go back to trigger-action if no data form
          setCurrentStep(
            selectedAction &&
              selectedAction.body &&
              selectedAction.body.length > 0
              ? "trigger-data"
              : "trigger-action",
          );
          break;
        case "reaction-action":
          setCurrentStep("reaction-service");
          setSelectedReaction(null);
          break;
        case "reaction-data":
          setCurrentStep("reaction-action");
          break;
        case "name":
          // If coming from name, go back to reaction-action if no data form
          setCurrentStep(
            selectedReaction &&
              selectedReaction.body &&
              selectedReaction.body.length > 0
              ? "reaction-data"
              : "reaction-action",
          );
          setName("");
          break;
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentStep, selectedAction, selectedReaction]);

  // Cache data in session storage
  const cacheData = (key: string, data: unknown) => {
    sessionStorage.setItem(key, JSON.stringify(data));
  };

  const getCachedData = <T,>(key: string): T | null => {
    const data = sessionStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  };

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

  // Fetch actions immediately
  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoadingActions(true);
        // Check cache first for actions
        const cachedActions = getCachedData<Action[]>("available-actions");
        if (cachedActions) {
          setAvailableActions(cachedActions);
          setLoadingActions(false);
          return;
        }

        // Fetch fresh actions data
        const actionsResponse = await api.get("/actions");
        setAvailableActions(actionsResponse.data);
        cacheData("available-actions", actionsResponse.data);
      } catch (err) {
        console.error("Failed to load actions:", err);
        showToast("Failed to load available actions", "error");
      } finally {
        setLoadingActions(false);
      }
    };

    fetchActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch reactions only when needed
  useEffect(() => {
    const fetchReactions = async () => {
      if (!currentStep.startsWith("reaction")) return;

      try {
        setLoadingReactions(true);
        // Check cache first for reactions
        const cachedReactions = getCachedData<Reaction[]>(
          "available-reactions",
        );
        if (cachedReactions) {
          setAvailableReactions(cachedReactions);
          setLoadingReactions(false);
          return;
        }

        // Fetch fresh reactions data
        const reactionsResponse = await api.get("/reactions");
        setAvailableReactions(reactionsResponse.data);
        cacheData("available-reactions", reactionsResponse.data);
      } catch (err) {
        console.error("Failed to load reactions:", err);
        showToast("Failed to load available reactions", "error");
      } finally {
        setLoadingReactions(false);
      }
    };

    fetchReactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // Update loading state to depend on the current step
  useEffect(() => {
    if (currentStep.startsWith("trigger")) {
      setLoading(loadingActions);
    } else if (currentStep.startsWith("reaction")) {
      setLoading(loadingReactions);
    } else {
      setLoading(false);
    }
  }, [currentStep, loadingActions, loadingReactions]);

  const handleBack = () => {
    if (currentStep !== "trigger-service") {
      window.history.back();
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    let nextStep: WorkflowStep | null = null;

    switch (currentStep) {
      case "trigger-service":
        if (selectedService) {
          nextStep = "trigger-action";
        }
        break;
      case "trigger-action":
        if (selectedAction) {
          // Skip trigger-data if no body fields
          nextStep =
            !selectedAction.body || selectedAction.body.length === 0
              ? "reaction-service"
              : "trigger-data";
        }
        break;
      case "trigger-data":
        nextStep = "reaction-service";
        break;
      case "reaction-service":
        if (selectedService) {
          nextStep = "reaction-action";
        }
        break;
      case "reaction-action":
        if (selectedReaction) {
          // Skip reaction-data if no body fields
          nextStep =
            !selectedReaction.body || selectedReaction.body.length === 0
              ? "name"
              : "reaction-data";
        }
        break;
      case "reaction-data":
        nextStep = "name";
        break;
    }

    if (nextStep) {
      window.history.pushState(null, "", "");
      setCurrentStep(nextStep);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "trigger-service":
        return "Select a Service for the Action";
      case "trigger-action":
        return `Select an Action from ${selectedService?.name}`;
      case "trigger-data":
        return `Configure ${formatActionReactionName(selectedAction?.name)} Action`;
      case "reaction-service":
        return "Select a Service for the Reaction";
      case "reaction-action":
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
      case "trigger-action":
      case "trigger-data":
        return "trigger";
      case "reaction-service":
      case "reaction-action":
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

      await api.post("/workflow", payload);
      showToast("Workflow created successfully", "success");
      router.push("/workflows");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to create workflow",
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
            loading={loading}
          />
        );
      case "trigger-action":
        if (!selectedService) return null;
        const serviceActions = actionsByService.get(selectedService.id) ?? [];
        return (
          <TriggerList
            triggers={serviceActions}
            selectedTrigger={selectedAction}
            onSelect={setSelectedAction}
            loading={loadingActions}
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
            loading={loading}
          />
        );
      case "reaction-action":
        return (
          <ReactionList
            reactions={reactionsByService.get(selectedService?.id ?? -1) ?? []}
            selectedReaction={selectedReaction}
            onSelect={setSelectedReaction}
            loading={loading}
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
      {currentStep !== "trigger-data" && currentStep !== "reaction-data" && (
        <div className="w-full rounded-t-lg border border-gray-100 bg-white p-4 py-6 shadow-md duration-200">
          <div className="mx-auto flex w-full items-center justify-between">
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
                    : currentStep === "trigger-action"
                      ? !selectedAction
                      : currentStep === "reaction-action"
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
      )}
    </div>
  );
}
