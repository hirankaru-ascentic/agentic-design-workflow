import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { StatusBadge } from "@/design-system"

const meta = {
  title: "Design system/StatusBadge",
  component: StatusBadge,
  args: { status: "active" },
} satisfies Meta<typeof StatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {}
export const Paused: Story = { args: { status: "paused" } }
export const Churned: Story = { args: { status: "churned" } }

export const AllStatusesDark: Story = {
  globals: { theme: "dark" },
  render: () => (
    <div className="flex gap-2">
      <StatusBadge status="active" />
      <StatusBadge status="paused" />
      <StatusBadge status="churned" />
    </div>
  ),
}
