import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Profile",
  },
  {
    accessorKey: "amount",
    header: "Time",
  },
  {
    accessorKey: "amount",
    header: "Queue",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]
