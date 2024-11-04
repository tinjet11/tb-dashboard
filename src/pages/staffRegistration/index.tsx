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
import { Mail, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { useHospitalStore } from "@/store/hospitalStore";

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(["Doctor", "Nurse", "Healthcare Worker"]),
  hospital: z.string().min(1),
});

export function StaffRegisterForm() {
  const { registerStaffAndSetPrefs } = useAuthStore();
  const { hospitals, fetchHospitals, error } = useHospitalStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      role: "Healthcare Worker",
      hospital: "",
    },
  });

  function generateSecurePassword(length = 12): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    return password;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const password = generateSecurePassword(12);
      registerStaffAndSetPrefs({
        ...values, // Spread all properties of values
        password, // Add the generated password
      });
    } catch (error) {
      console.error("Account Creation Failed:", error);
    }
  }

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Staff Registration
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="border-gray-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input
                      placeholder="Enter your name"
                      className="border-gray-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange} /* value={field.value} */
                  >
                    <FormControl>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Doctor">Doctor</SelectItem>
                      <SelectItem value="Nurse">Nurse</SelectItem>
                      <SelectItem value="Healthcare Worker">
                        Healthcare Worker
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hospital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital</FormLabel>
                  <Select
                    onValueChange={field.onChange} /* value={field.value} */
                  >
                    <FormControl>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Select a hospital" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {error}
                      {hospitals &&
                        hospitals.map((hospital) => (
                          <SelectItem key={hospital.$id} value={hospital.$id}>
                            {hospital.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
