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
import { MoreHorizontal } from "lucide-react";
import { AdministrationRecordDialog } from "../../../appointments/AdministrationRecordDialog";
import { useEffect, useState } from "react";
import { toZonedTime } from "date-fns-tz";

// Calculate the time left in milliseconds
const calculateTimeLeft = (targetDate: Date) => {
  const now = new Date();
  const timeDifference = targetDate.getTime() - now.getTime();
  return timeDifference > 0 ? timeDifference : null; // Return null if expired
};

// Format time into days, hours, minutes, and seconds
const formatTimeLeft = (timeLeft: number) => {
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export const columns: ColumnDef<Administration>[] = [
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
    accessorKey: "record.datetime",
    header: "Countdown",
    cell: ({ getValue }) => {
      const dateValue = getValue() as string;
      const targetDate = new Date(dateValue);
      const targetDatePlus72Hours = new Date(
        targetDate.getTime() + 48 * 60 * 60 * 1000
      );

      // Create a Countdown component
      const Countdown = () => {
        const [timeLeft, setTimeLeft] = useState(() =>
          calculateTimeLeft(targetDatePlus72Hours)
        );

        useEffect(() => {
          const interval = setInterval(() => {
            const newTimeLeft = calculateTimeLeft(targetDatePlus72Hours);
            setTimeLeft(newTimeLeft);
          }, 1000); // Update every second

          return () => clearInterval(interval); // Cleanup on unmount
        }, []);

        return timeLeft ? formatTimeLeft(timeLeft) : "Expired";
      };

      return <Countdown />;
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() =>
                  console.log(
                    `Viewing patient ${administrationData.patient.name}`
                  )
                }
              >
                Remind Patient
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  console.log(
                    `Viewing questionnaire answer for ${administrationData.questionnaire.questionId}`
                  )
                }
              >
                View Questionnaire Answer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
