import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { PlusIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"

const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: "Add client" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args}>Default</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="destructive">Destructive</Button>
      <Button {...args} variant="link">Link</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args} size="xs">Extra small</Button>
      <Button {...args} size="sm">Small</Button>
      <Button {...args}>Default</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
}

/** Icon-only buttons need an `aria-label`. */
export const IconOnly: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Button {...args} size="icon-sm" variant="ghost" aria-label="Delete client">
        <Trash2Icon />
      </Button>
      <Button {...args} size="icon" aria-label="Add client">
        <PlusIcon />
      </Button>
    </div>
  ),
}

export const WithIcon: Story = {
  args: { children: <><PlusIcon data-icon="inline-start" />Add client</> },
}

export const Disabled: Story = { args: { disabled: true } }

export const VariantsDark: Story = { ...Variants, globals: { theme: "dark" } }
