import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { AppShell, PageHeader, ThemeProvider } from "@/design-system"

const meta = {
  title: "Design system/AppShell",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
    nextjs: { navigation: { pathname: "/" } },
  },
  args: {
    children: (
      <PageHeader title="Dashboard" description="An overview of your clients and contracts." />
    ),
  },
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light" enableSystem={false} storageKey="storybook-theme">
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

/** Dashboard is the active menu item. */
export const Dashboard: Story = {}

/** Clients is the active menu item. */
export const ClientsPage: Story = {
  parameters: { nextjs: { navigation: { pathname: "/clients" } } },
  args: { children: <PageHeader title="Clients" /> },
}

/** On a phone the sidebar becomes a sheet behind the menu button. */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile1" } },
}

export const Dark: Story = { globals: { theme: "dark" } }
