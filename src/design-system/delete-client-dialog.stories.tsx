import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Trash2Icon } from "lucide-react"
import { fn } from "storybook/test"

import { Button } from "@/components/ui/button"
import { DeleteClientDialog } from "@/design-system"

const meta = {
  title: "Design system/DeleteClientDialog",
  component: DeleteClientDialog,
  args: {
    clientName: "Ada Lovelace",
    onConfirm: fn(),
    trigger: (
      <Button variant="destructive">
        <Trash2Icon />
        Delete client
      </Button>
    ),
  },
} satisfies Meta<typeof DeleteClientDialog>

export default meta
type Story = StoryObj<typeof meta>

/** Closed: only the trigger shows. */
export const Closed: Story = {}

export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Delete client" }))
  },
}

export const OpenDark: Story = { ...Open, globals: { theme: "dark" } }
