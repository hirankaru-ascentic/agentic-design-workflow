import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { clientsSeed } from "@/data/clients.seed"
import { ClientForm } from "@/design-system"

const { name, company, email, status, contractValue, startDate } = clientsSeed[0]
const existingClient = { name, company, email, status, contractValue, startDate }

const meta = {
  title: "Design system/ClientForm",
  component: ClientForm,
  args: { onSubmit: fn(), onCancel: fn() },
  decorators: [(Story) => <div className="max-w-xl"><Story /></div>],
} satisfies Meta<typeof ClientForm>

export default meta
type Story = StoryObj<typeof meta>

/** Creating a client: empty fields. */
export const New: Story = { args: { submitLabel: "Create client" } }

/** Editing a client: fields filled from `defaultValues`. */
export const Edit: Story = { args: { defaultValues: existingClient } }

/** Submitting empty shows the validation errors. */
export const ValidationErrors: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Save client" }))
  },
}

export const WithoutCancel: Story = { args: { onCancel: undefined } }

export const Dark: Story = { ...Edit, globals: { theme: "dark" } }
