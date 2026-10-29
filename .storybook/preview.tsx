import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/nextjs-vite";
import { Geist, Geist_Mono } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";
import "../src/app/globals.css";

// Same fonts as src/app/layout.tsx, so components render as in the app.
const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const preview: Preview = {
  parameters: {
    layout: "padded",
    nextjs: { appDirectory: true },
    // Fail stories with accessibility violations in the a11y panel.
    a11y: { test: "error" },
  },
  decorators: [
    (Story) => (
      <div className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      </div>
    ),
    // Toolbar switch, and `globals: { theme: "dark" }` in a story, set the
    // .dark class that globals.css uses for dark tokens.
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
