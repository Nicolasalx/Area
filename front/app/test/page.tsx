"use client";

import { ArrowRight, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

export default function TestPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-8">
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
      <div className="space-y-4 rounded-lg border p-6 text">
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
    </div>
  );
}
