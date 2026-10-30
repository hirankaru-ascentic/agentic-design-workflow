import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Input } from "@/components/ui/input"

const meta = {
  title: "UI/Input",
  component: Input,
  args: { placeholder: "Search name, company or email", "aria-label": "Search clients" },
  decorators: [(Story) => <div className="max-w-xs"><Story /></div>],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Filled: Story = { args: { defaultValue: "Acme" } }
export const Disabled: Story = { args: { disabled: true } }
export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "not-an-email" } }
export const Dark: Story = { ...Invalid, globals: { theme: "dark" } }
