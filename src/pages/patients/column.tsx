import { Patient } from "@/appwrite/model";

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "id",
    header: "IC",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
];
