import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { clientsSeed } from "@/data/clients.seed"
import { ClientTable } from "@/design-system"

const meta = {
  title: "Design system/ClientTable",
  component: ClientTable,
  args: { clients: clientsSeed.slice(0, 8), onDelete: fn() },
} satisfies Meta<typeof ClientTable>

export default meta
type Story = StoryObj<typeof meta>

/** Search, status filter, and edit and delete actions per row. */
export const Full: Story = {}

/** Used on the dashboard's recent clients card. */
export const Compact: Story = {
  args: { variant: "compact", clients: clientsSeed.slice(0, 5) },
}

/** Without `onDelete`, rows have no delete button. */
export const WithoutDelete: Story = { args: { onDelete: undefined } }

/** `clients={null}` while the client store loads. */
export const Loading: Story = { args: { clients: null } }

export const Empty: Story = { args: { clients: [] } }

export const Dark: Story = { globals: { theme: "dark" } }
