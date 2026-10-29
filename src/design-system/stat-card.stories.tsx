import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { CircleDollarSignIcon, UsersIcon } from "lucide-react"

import { StatCard } from "@/design-system"

const meta = {
  title: "Design system/StatCard",
  component: StatCard,
  args: { label: "Total clients", value: 25, icon: UsersIcon },
  decorators: [(Story) => <div className="max-w-xs"><Story /></div>],
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  args: {
    label: "Total contract value",
    value: "$1,240,000",
    hint: "Across all clients, per year",
    icon: CircleDollarSignIcon,
  },
}

export const WithoutIcon: Story = { args: { icon: undefined } }

/** `value={null}` while the client store loads. */
export const Loading: Story = { args: { value: null } }

export const Dark: Story = { ...WithHint, globals: { theme: "dark" } }
