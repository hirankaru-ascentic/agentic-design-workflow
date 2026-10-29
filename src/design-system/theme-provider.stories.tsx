import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "@/components/ui/button"
import { ThemeProvider, ThemeToggle } from "@/design-system"

/**
 * Wraps the app in src/app/layout.tsx and sets the `.dark` class on <html>
 * from the user's choice or system setting. It renders no UI of its own;
 * this story shows it driving ThemeToggle.
 */
const meta = {
  title: "Design system/ThemeProvider",
  component: ThemeProvider,
  args: { defaultTheme: "light", enableSystem: false, storageKey: "storybook-theme" },
  render: (args) => (
    <ThemeProvider {...args}>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </ThemeProvider>
  ),
} satisfies Meta<typeof ThemeProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Dark: Story = { globals: { theme: "dark" } }
