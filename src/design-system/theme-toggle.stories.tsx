import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ThemeProvider, ThemeToggle } from "@/design-system"

/** Needs ThemeProvider (next-themes) above it, as in the app layout. */
const meta = {
  title: "Design system/ThemeToggle",
  component: ThemeToggle,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light" enableSystem={false} storageKey="storybook-theme">
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>

export default meta
type Story = StoryObj<typeof meta>

/** Shows the sun icon; clicking switches the whole page to dark. */
export const Light: Story = {}

/** Shows the moon icon. */
export const Dark: Story = { globals: { theme: "dark" } }
