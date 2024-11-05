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
import { Phone, User, IdCard } from "lucide-react";
import toast from "react-hot-toast";
import { Account, Client } from "appwrite";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  identificationNumber: z
    .string()
    .regex(/^\d{12}$/, { message: "Identification number must be 12 digits" }),
  phoneNumber: z.string(),
});

export function PatientRegisterForm() {
  //const { sendPasswordResetEmail } = useAuthStore();
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
        .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Your project ID

      const account = new Account(client);

      const result = await account.createPhoneToken(
        values.identificationNumber, // userId
        values.phoneNumber // phone
      );

      // Show success message
      toast.success("Patient registered successfully!");
      console.log("Phone token result:", result);
    } catch (error) {
      console.error("Error creating phone token:", error);
      toast.error("Error occur during patient registration. Please try again.");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Patient Registration
        </h2>
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
                    <Input
                      placeholder="Enter your 12-digit ID number"
                      {...field}
                    />
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
      </div>
    </div>
  );
}
