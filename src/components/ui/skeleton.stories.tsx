import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Skeleton } from "@/components/ui/skeleton"

/** Loading placeholder; size it with Tailwind classes. */
const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  args: { className: "h-8 w-24" },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TableRows: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-2">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-5 w-full" />
      ))}
    </div>
  ),
}

export const Dark: Story = { globals: { theme: "dark" } }
