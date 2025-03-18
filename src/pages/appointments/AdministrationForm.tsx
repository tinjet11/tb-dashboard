import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ID } from "appwrite";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar, ChevronsUpDown, Check, Plus } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import db from "@/appwrite/databases";
import { useAuthStore } from "@/store/authStore";
import { Administration } from "@/lib/type";
import { addHours, formatISO, parseISO } from "date-fns";

const formSchema = z.object({
  appointmentDateTime: z
    .string()
    .nonempty({ message: "Appointment date and time are required" }),
  patient: z.string().nonempty({ message: "Please select a patient" }),
});

export function AdministrationFormDialog() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointmentDateTime: "",
      patient: "",
    },
  });

  const [patients, setPatients] = useState<{ name: string; id: string }[]>([]);

  useEffect(() => {
    const listPatients = async () => {
      try {
        const response = await db.Patient.list();
        setPatients(
          response.documents.map((doc: any) => ({
            name: doc.name,
            id: doc.$id,
          }))
        );
      } catch (error) {
        console.error("Error listing patients:", error);
        toast.error("Failed to load patients.");
      }
    };
    listPatients();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const questionaire_id = await createNewQuestionaire();

      const payload = {
        patient: values.patient,
        questionnaire: questionaire_id,
        appointment_time: values.appointmentDateTime, // Store in UTC
        hospital: user.prefs.hospital,
      };

      await createNewAdministration(payload);
      toast.success("Appointment scheduled successfully!");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      toast.error("Error scheduling appointment. Please try again.");
    }
  }

  const createNewQuestionaire = async () => {
    const payload = { question_id: "672f1a90000d1898860f" };
    try {
      const response = await db.Questionnaire.create(payload);
      return response.$id;
    } catch (error) {
      console.error("Error creating questionnaire:", error);
    }
  };

  const createNewAdministration = async (payload: Administration) => {
    try {
      await db.Administration.create(payload, ID.unique());
    } catch (error) {
      console.error("Error creating administration:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-5 h-5" /> Schedule Appointment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 my-4"
          >
            <FormField
              control={form.control}
              name="appointmentDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Calendar className="inline mr-2" /> Appointment Date & Time
                  </FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patient"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Patient</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? patients.find(
                                (patient) => patient.id === field.value
                              )?.name
                            : "Select patient"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search patient..." />
                        <CommandList>
                          <CommandEmpty>No patient found.</CommandEmpty>
                          <CommandGroup>
                            {patients.map((patient) => (
                              <CommandItem
                                value={patient.name}
                                key={patient.id}
                                onSelect={() => {
                                  form.setValue("patient", patient.id);
                                }}
                              >
                                {patient.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    patient.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the patient that will be scheduled an administration
                    appoinment.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting
                ? "Scheduling..."
                : "Schedule Appointment"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
