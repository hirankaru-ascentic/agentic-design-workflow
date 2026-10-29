import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATUS_FILTER_ITEMS } from "@/lib/clients"

const meta = {
  title: "UI/Select",
  component: Select,
  args: { items: STATUS_FILTER_ITEMS, defaultValue: "all" },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Filter by status" className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_FILTER_ITEMS.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Filter by status" }))
  },
}

export const Disabled: Story = { args: { disabled: true } }

export const OpenDark: Story = { ...Open, globals: { theme: "dark" } }
