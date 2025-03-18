import { Administration } from "@/appwrite/model";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";

export const columns: ColumnDef<Administration>[] = 
[
  {
    accessorKey: "patient.name",
    header: "Name",
  },
  {
    accessorKey: "record.datetime",
    header: "Administration DateTime",
    cell: ({ getValue }) => {
         const dateValue = getValue() as string;
         const utcDate = parseISO(dateValue);
   
         // Force it to stay in UTC
         const utcFormattedDate = format(
           toZonedTime(utcDate, "UTC"),
           "dd/MM/yyyy, hh:mm a"
         );
   
         return utcFormattedDate;
    },
  },
  {
    accessorKey: "analysis.result",
    header: "Result",
  },  
  {
    accessorKey: "analysis.status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
  
      const statusStyles: Record<string, string> = {
        pending: "text-yellow-600 bg-yellow-100",
        approved: "text-green-600 bg-green-100",
        rejected: "text-red-600 bg-red-100",
      };
  
      return (
        <span className={`px-2 py-1 rounded-md text-sm font-medium ${statusStyles[status] || "text-gray-600 bg-gray-100"}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const administrationData = row.original;
      const navigate = useNavigate();
      const { patient, questionnaire, analysis } = administrationData;
      const goToTSTResultPage = () => {
        navigate("/result", {
          state: { patient, questionnaire, analysis }, // Pass the required data
        });
      };
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => goToTSTResultPage()}>
                View Result
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
