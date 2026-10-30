import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

/** Label, control, description and error, as used in ClientForm. */
const meta = {
  title: "UI/Field",
  component: Field,
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" type="email" placeholder="name@company.com" />
      <FieldDescription>Used for contract reminders.</FieldDescription>
    </Field>
  ),
}

export const WithError: Story = {
  render: () => (
    <Field data-invalid>
      <FieldLabel htmlFor="email-invalid">Email</FieldLabel>
      <Input id="email-invalid" aria-invalid aria-describedby="email-error" defaultValue="ada@" />
      <FieldError id="email-error">Enter a valid email address.</FieldError>
    </Field>
  ),
}

export const Group: Story = {
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input id="name" />
      </Field>
      <Field>
        <FieldLabel htmlFor="company">Company</FieldLabel>
        <Input id="company" />
      </Field>
    </FieldGroup>
  ),
}

export const Dark: Story = { ...WithError, globals: { theme: "dark" } }
