import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Calendar } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import db from "@/appwrite/databases";
import { ID } from "appwrite";
import { Administration } from "@/appwrite/model";
import { useAuthStore } from "@/store/authStore";

const formSchema = z.object({
  datetime: z
    .string()
    .nonempty("Date & time is required")
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Invalid date & time format",
    }),
  injection_site: z.string().nonempty("Injection site is required"),
  ppd_manufacturer: z.string().nonempty("PPD manufacturer is required"),
  ppd_lot_number: z.string().nonempty("PPD lot number is required"),
  ppd_expiration_date: z
    .string()
    .nonempty("PPD expiration date is required")
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Invalid expiration date format",
    }),
});

type AdministrationRecordFormData = z.infer<typeof formSchema>;

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  administrationData: Administration;
};

export function AdministrationRecordDialog({
  isOpen,
  onOpenChange,
  administrationData,
}: Props) {
  const { user } = useAuthStore();

  const form = useForm<AdministrationRecordFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      datetime: "",
      injection_site: "",
      ppd_manufacturer: "",
      ppd_lot_number: "",
      ppd_expiration_date: "",
    },
  });

  const onSubmit = async (data: AdministrationRecordFormData) => {
    const payload = {
      datetime: data.datetime,
      injection_site: data.injection_site,
      ppd_manufacturer: data.ppd_manufacturer,
      ppd_lot_number: data.ppd_lot_number,
      ppd_expiration_date: data.ppd_expiration_date,
      staff_id: user?.$id
    };

    console.log(payload);
    await createNewRecord(payload);

    toast.success("Administration record saved successfully.");
    onOpenChange(false);
  };

  const createNewRecord = async (payload: any) => {
    try {
      const recordId = ID.unique();
      const response = await db.Record.create(payload, recordId);
      console.log("Administration created:", response);
      await addRecordToAdministration(recordId);
    } catch (error) {
      console.error("Error creating administration:", error);
    }
  };

  const addRecordToAdministration = async (recordId: string) => {
    try {
      const response = await db.Administration.update(administrationData.id, {
        record: recordId,
      });
      console.log("Record added into administration:", response);
    } catch (error) {
      console.log("Error during adding record to administration");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] py-16">
        <DialogHeader>
          <DialogTitle>Administration Record</DialogTitle>
          <DialogDescription>
            Enter the details of the administration record below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="datetime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      Date & Time
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
                name="injection_site"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Injection Site</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Injection Site"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ppd_manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PPD Manufacturer</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="PPD Manufacturer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ppd_lot_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PPD Lot Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="PPD Lot Number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ppd_expiration_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PPD Expiration Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save Record</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
