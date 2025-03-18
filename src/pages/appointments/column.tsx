import { Administration } from "@/appwrite/model";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { CheckCircle, Plus } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AdministrationRecordDialog } from "./AdministrationRecordDialog";

export const columns: ColumnDef<Administration>[] = [
  {
    accessorKey: "patient_id",
    header: "IC",
    accessorFn: (row) => row.patient?.id || "", 
  },
  {
    accessorKey: "patient.name",
    header: "Name",
  },
  {
    accessorKey: "appointment_time",
    header: "Appointment Time",
    cell: ({ getValue }) => {
      const dateValue = getValue() as string;
      const utcDate = parseISO(dateValue);
      
      // Force it to stay in UTC
      const utcFormattedDate = format(toZonedTime(utcDate, "UTC"), "dd/MM/yyyy, hh:mm a");
      
      return utcFormattedDate;
    },
  },
  {
    accessorKey: "record",
    header: "Status",
    cell: ({ row }) => {
      const record = row.original.record;
      if (!record) {
        return (
          <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md">
            Pending Consultation
          </span>
        );
      }
      return (
        <span className="text-green-600 bg-green-100 px-2 py-1 rounded-md">
          Completed
        </span>
      );
    },
  },  
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const administrationData = row.original;
      const isRecordExists = administrationData.record != null;
      return (
        <>
          {isRecordExists && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CheckCircle className="text-green-500" size={20} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Record has already been added</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {!isRecordExists && (
            <Button variant="default" onClick={() => setIsDialogOpen(true)}>
              <Plus /> Add Record
            </Button>
          )}

          <AdministrationRecordDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            administrationData={administrationData} // Pass the relevant record data if needed
          />
        </>
      );
    },
  },
];
