import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/design-system"

const meta = {
  title: "Design system/PageHeader",
  component: PageHeader,
  args: {
    title: "Dashboard",
    description: "An overview of your clients and contracts.",
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TitleOnly: Story = { args: { description: undefined } }

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button variant="outline">Export</Button>
        <Button>Add client</Button>
      </>
    ),
  },
}

export const Dark: Story = { ...WithActions, globals: { theme: "dark" } }
