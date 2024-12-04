"use client";

import { ArrowRight, Mail, Plus, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import Card from "@/components/ui/Card";
import Form from "@/components/ui/Form";
import Checkbox from "@/components/ui/Checkbox";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import { useToast } from "@/contexts/ToastContext";

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
};

export default function TestPage() {
  const { showToast } = useToast();

  return (
    <div className="text-md mx-auto max-w-3xl space-y-8 p-8">
      {/* Text Component Tests */}
      <div className="space-y-4 rounded-lg border p-6">
        <Text variant="h2">Text Component</Text>

        {/* Basic Text */}
        <Text>This is the default text style</Text>

        {/* Text Variants */}
        <div className="space-y-2">
          <Text variant="h1">Heading 1</Text>
          <Text variant="h2">Heading 2</Text>
          <Text variant="h3">Heading 3</Text>
          <Text variant="small">Small text example</Text>
        </div>

        {/* Styled Text */}
        <div className="space-y-2">
          <Text weight="bold">Bold text example</Text>
          <Text italic>Italic text example</Text>
          <Text color="red">Red colored text</Text>
          <Text className="bg-black" color="white">
            White text on black
          </Text>
        </div>

        {/* Truncated Text */}
        <div>
          <Text lineClamp={2}>
            This is a long text that will be clamped to two lines. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Maxime mollitia
            molestiae quas vel sint commodi repudiandae consequuntur voluptatum
            laborum.
          </Text>
        </div>
      </div>

      {/* Button Component Tests */}
      <div className="text space-y-4 rounded-lg border p-6">
        <Text variant="h2">Button Component</Text>

        {/* Basic Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button>Default Button</Button>
          <Button disabled>Disabled Button</Button>
          <Button isLoading>Loading</Button>
        </div>

        {/* Buttons with Icons */}
        <div className="flex flex-wrap gap-4">
          <Button leftIcon={<Plus />}>Add New</Button>
          <Button rightIcon={<ArrowRight />}>Continue</Button>
          <Button leftIcon={<Plus />} rightIcon={<ArrowRight />}>
            Both Icons
          </Button>
        </div>

        {/* Link Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button href="/dashboard">Internal Link</Button>
          <Button
            href="https://github.com"
            target="_blank"
            rightIcon={<ArrowRight />}
          >
            External Link
          </Button>
        </div>

        {/* Interactive Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => alert("Button clicked!")}>Click Me</Button>
          <Button
            onClick={() => alert("Custom styled!")}
            className="bg-blue-500"
          >
            Custom Style
          </Button>
        </div>
      </div>
      {/* Card Component Tests */}
      <div className="space-y-4 rounded-lg border p-6">
        <Text variant="h2">Card Component</Text>

        {/* Basic Card */}
        <Card>
          <Card.Header>
            <Text variant="h4">Basic Card</Text>
          </Card.Header>
          <Card.Body>
            <Text>This is a simple card with just header and body.</Text>
          </Card.Body>
        </Card>

        {/* Card with all sections */}
        <Card className="mt-4">
          <Card.Header>
            <Text variant="h4">Complete Card</Text>
          </Card.Header>
          <Card.Body>
            <Text>This card demonstrates all sections including a footer.</Text>
          </Card.Body>
          <Card.Footer>
            <div className="flex justify-end gap-4">
              <Button>Cancel</Button>
              <Button rightIcon={<ArrowRight />}>Continue</Button>
            </div>
          </Card.Footer>
        </Card>

        {/* Interactive Card */}
        <Card
          className="mt-4"
          hover={true}
          onClick={() => alert("Card clicked!")}
        >
          <Card.Body>
            <Text>This is a clickable card with hover effect.</Text>
          </Card.Body>
        </Card>

        {/* Styled Cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card shadow="large" border={false}>
            <Card.Header className="bg-gray-50">
              <Text variant="h4">Large Shadow</Text>
            </Card.Header>
            <Card.Body>
              <Text>Card with large shadow and no border.</Text>
            </Card.Body>
          </Card>

          <Card className="bg-gray-50">
            <Card.Header className="bg-white">
              <Text variant="h4">Custom Background</Text>
            </Card.Header>
            <Card.Body>
              <Text>Card with custom background color.</Text>
            </Card.Body>
          </Card>
        </div>

        {/* Complex Card */}
        <Card className="mt-4 bg-amber-600">
          <Card.Header>
            <div className="flex items-center justify-between">
              <Text variant="h4">Complex Layout</Text>
              <Button leftIcon={<Plus />} className="bg-blue-500">
                Add Item
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <Text>
                This card shows a more complex layout with multiple elements.
              </Text>
              <div className="rounded-lg bg-white bg-opacity-50 p-4">
                <Text>Nested content example</Text>
              </div>
            </div>
          </Card.Body>
          <Card.Footer>
            <div className="flex items-center justify-between">
              <Text variant="small" color="gray">
                Last updated: 2 hours ago
              </Text>
              <Button rightIcon={<ArrowRight />}>View All</Button>
            </div>
          </Card.Footer>
        </Card>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Default hover effect */}
          <Card hover={true}>
            <Card.Body>
              <Text>Default hover effect (shadow)</Text>
            </Card.Body>
          </Card>

          {/* Translate effect */}
          <Card hover="translate">
            <Card.Body>
              <Text>Card moves up on hover</Text>
            </Card.Body>
          </Card>

          {/* Scale effect */}
          <Card hover="scale">
            <Card.Body>
              <Text>Card scales up on hover</Text>
            </Card.Body>
          </Card>

          {/* Enhanced shadow */}
          <Card hover="shadow">
            <Card.Body>
              <Text>Enhanced shadow on hover</Text>
            </Card.Body>
          </Card>

          {/* All effects combined */}
          <Card hover="all">
            <Card.Body>
              <Text>All hover effects combined</Text>
            </Card.Body>
          </Card>

          {/* Interactive card with hover */}
          <Card hover="all" onClick={() => alert("Clicked!")}>
            <Card.Body>
              <Text>Clickable card with all hover effects</Text>
            </Card.Body>
          </Card>
        </div>
      </div>
      <Form onSubmit={handleSubmit} className="max-w-md">
        <Input
          label="Username"
          placeholder="Enter your username"
          startIcon={<Search />}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          helperText="We'll never share your email"
          endIcon={<Mail />}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error="Password must be at least 8 characters"
        />

        <Select
          label="Country"
          options={[
            { value: "us", label: "United States" },
            { value: "uk", label: "United Kingdom" },
            { value: "ca", label: "Canada" },
          ]}
        />

        <Textarea label="Bio" placeholder="Tell us about yourself" rows={4} />

        <Checkbox
          label="I agree to the terms and conditions"
          helperText="Required for registration"
        />

        <Button type="submit">Submit</Button>
      </Form>

      {/* Toast Component Tests */}
      <div className="space-y-4 rounded-lg border p-6">
        <Text variant="h2">Toast Notifications</Text>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() =>
              showToast("Operation completed successfully!", "success")
            }
          >
            Show Success Toast
          </Button>
          <Button
            onClick={() =>
              showToast("Something went wrong. Please try again.", "error")
            }
          >
            Show Error Toast
          </Button>
          <Button
            onClick={() =>
              showToast(
                "Please review the changes before proceeding.",
                "warning",
              )
            }
          >
            Show Warning Toast
          </Button>
          <Button
            onClick={() =>
              showToast(
                "Your data is being processed in the background.",
                "info",
              )
            }
          >
            Show Info Toast
          </Button>
        </div>

        <Text variant="h3" className="mt-4">
          Custom Duration Toasts
        </Text>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() =>
              showToast("This toast will disappear quickly!", "info", 1000)
            }
          >
            Quick Toast (1s)
          </Button>
          <Button
            onClick={() =>
              showToast("This toast will stay longer...", "info", 5000)
            }
          >
            Long Toast (5s)
          </Button>
        </div>

        <Text variant="h3" className="mt-4">
          Multiple Toasts
        </Text>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => {
              showToast("First notification", "success");
              setTimeout(() => {
                showToast("Second notification", "info");
              }, 1000);
              setTimeout(() => {
                showToast("Third notification", "warning");
              }, 2000);
            }}
          >
            Show Multiple Toasts
          </Button>
        </div>

        <Text variant="h3" className="mt-4">
          Multiline Toasts
        </Text>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() =>
              showToast(
                "This is a longer toast message that will wrap to multiple lines. It demonstrates how the toast handles longer content while maintaining proper alignment with the icon.",
                "info",
              )
            }
          >
            Show Long Toast
          </Button>
          <Button
            onClick={() =>
              showToast(
                "Error details:\n- Invalid input\n- Missing required fields\n- Server connection failed",
                "error",
              )
            }
          >
            Show List Toast
          </Button>
          <Button
            onClick={() => {
              showToast("Step 1: Processing data...", "info");
              setTimeout(() => {
                showToast(
                  "Step 2: This is a longer message that explains what's happening in more detail and might wrap to multiple lines.",
                  "info",
                );
              }, 1000);
              setTimeout(() => {
                showToast(
                  "Step 3: Process completed successfully!\nAll tasks were completed without any errors.",
                  "success",
                );
              }, 2000);
            }}
          >
            Show Process Steps
          </Button>
        </div>
      </div>
    </div>
  );
}
