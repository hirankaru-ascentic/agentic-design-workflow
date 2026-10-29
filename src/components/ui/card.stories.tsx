import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const meta = {
  title: "UI/Card",
  component: Card,
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Recent clients</CardTitle>
        <CardDescription>Latest by start date</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">View all</Button>
        </CardAction>
      </CardHeader>
      <CardContent>Card content goes here.</CardContent>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Small: Story = { args: { size: "sm" } }
export const Dark: Story = { globals: { theme: "dark" } }
