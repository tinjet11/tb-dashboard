import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Phone, User, IdCard, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Account, Client } from "appwrite";
import db from "@/appwrite/databases";
import { useAuthStore } from "@/store/authStore";
import { Patient } from "@/lib/type";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  identificationNumber: z
    .string()
    .regex(/^\d{12}$/, { message: "Identification number must be 12 digits" }),
  phoneNumber: z.string().min(1, { message: "Phone Number is required" }),
});

export function PatientRegisterForm() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false); // Control dialog visibility

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      identificationNumber: "",
      phoneNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const client = new Client()
        .setEndpoint("https://cloud.appwrite.io/v1")
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
      const account = new Account(client);
      const response = await account.createPhoneToken(
        values.identificationNumber,
        values.phoneNumber
      );

      const patientPayload = {
        name: values.name,
        staff_id: user.$id,
        hospital_id: user?.prefs?.hospital,
      };

      createPatient(values.identificationNumber, patientPayload);
      console.log("Patient added successfully to auth:", response);
      toast.success("Patient registered successfully!");
      setOpen(false); // Close modal on success
      form.reset(); // Reset form fields
    } catch (error) {
      console.error("Error creating phone token:", error);
      toast.error("Error during patient registration. Please try again.");
    }
  }

  const createPatient = async (userId: string, payload: Patient) => {
    try {
      const response = await db.Patient.create(payload, userId);
      console.log("Patient created successfully in database:", response);
      addUserToHospital(userId);
    } catch (error) {
      console.error("Error saving user to database:", error);
    }
  };

  const addUserToHospital = async (userId: string) => {
    try {
      const hospitalId = user?.prefs.hospital;
      const result = await db.Hospital.get(hospitalId);
      let patientIds = result.patient || [];
      patientIds.push(userId);

      const response = await db.Hospital.update(hospitalId, {
        patient: patientIds,
      });
      console.log("User Added to Hospital:", response);
    } catch (error) {
      console.error("Error adding user to hospital:", error);
    }
  };

  return (
    <div>
      {/* Button to open modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Patient
          </Button>
        </DialogTrigger>
        
        {/* Modal Content */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient Registration</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-400" />
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="identificationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IdCard className="w-5 h-5 text-gray-400" />
                      Identification Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your 12-digit ID number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-gray-400" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full py-3 mt-4 text-white rounded-md font-medium transition duration-200"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="spinner-border animate-spin w-4 h-4 border-2 border-t-transparent border-white rounded-full"></span>
                    Registering...
                  </span>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
