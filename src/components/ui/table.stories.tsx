import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { clientsSeed } from "@/data/clients.seed"
import { formatCurrency } from "@/lib/format"

/** For lists of clients, use ClientTable from the design system. */
const meta = {
  title: "UI/Table",
  component: Table,
  render: (args) => (
    <Table {...args}>
      <TableCaption>Contract value per client</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Company</TableHead>
          <TableHead className="text-right">Contract value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientsSeed.slice(0, 5).map((client) => (
          <TableRow key={client.id}>
            <TableCell>{client.name}</TableCell>
            <TableCell>{client.company}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrency(client.contractValue)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Dark: Story = { globals: { theme: "dark" } }
