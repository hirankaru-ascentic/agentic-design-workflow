import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { clientsSeed } from "@/data/clients.seed"
import { NewClientsChart } from "@/design-system"
import { getNewClientsPerMonth } from "@/lib/clients"

const data = getNewClientsPerMonth(clientsSeed)

const meta = {
  title: "Design system/NewClientsChart",
  component: NewClientsChart,
  args: { data },
  decorators: [(Story) => <div className="max-w-xl"><Story /></div>],
} satisfies Meta<typeof NewClientsChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** `data={null}` while the client store loads. */
export const Loading: Story = { args: { data: null } }

/** No clients started in the last six months. */
export const Empty: Story = {
  args: { data: data.map((month) => ({ ...month, count: 0 })) },
}

export const Dark: Story = { globals: { theme: "dark" } }
