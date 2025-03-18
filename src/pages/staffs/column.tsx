import { Patient, Staff } from "@/appwrite/model";

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];
