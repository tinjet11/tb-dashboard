import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Plus, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useHospitalStore } from "@/store/hospitalStore";
import { ID } from "appwrite";
import toast from "react-hot-toast";
import db from "@/appwrite/databases";
import { ValueSetter } from "node_modules/date-fns/parse/_lib/Setter";

type Staff = {
  name: string;
  role: string;
  hospital_id: string;
};

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(["Doctor", "Nurse", "Healthcare Worker"]),
  hospital: z.string().min(1),
});

export function StaffRegisterForm() {
  const { sendPasswordResetEmail } = useAuthStore();
  const { hospitals, fetchHospitals, error } = useHospitalStore();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      role: "Healthcare Worker",
      hospital: "",
    },
  });

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { email, name, role, hospital } = values;
      const password = "SecurePass123!"; // Replace with a secure password generator
      const userId = ID.unique();
  
      const userCreated = await createUser(userId, email, password, name);
      if (!userCreated) return;
  
      await updateUserPrefs(userId, { role, hospital });
      await createStaff(userId, { name, role, hospital_id: hospital });
  
      toast.success("Account Created");
      sendPasswordResetEmail(email);
      setOpen(false); // Close modal after success
    } catch (error) {
      console.error("Account creation failed:", error);
      toast.error("Failed to create account. Please try again.");
    }
  };
  
  const createUser = async (userId: string, email: string, password: string, name: string) => {
    try {
      const response = await fetch("https://cloud.appwrite.io/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Response-Format": "1.6.0",
          "X-Appwrite-Project": import.meta.env.VITE_APPWRITE_PROJECT_ID,
          "X-Appwrite-Key": import.meta.env.VITE_APPWRITE_API_KEY,
        },
        body: JSON.stringify({ userId, email, password, name }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to create user");
      }
  
      return true;
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error creating user account.");
      return false;
    }
  };
  
  const updateUserPrefs = async (userId: string, prefs: any) => {
    try {
      const response = await fetch(`https://cloud.appwrite.io/v1/users/${userId}/prefs`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Response-Format": "1.6.0",
          "X-Appwrite-Project": import.meta.env.VITE_APPWRITE_PROJECT_ID,
          "X-Appwrite-Key": import.meta.env.VITE_APPWRITE_API_KEY,
        },
        body: JSON.stringify({ prefs }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to update preferences");
      }
  
      toast.success("Preferences updated successfully!");
    } catch (error) {
      console.error("Failed to update preferences:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  
  const createStaff = async (userId: string, payload: Staff) => {
    try {
      const response = await db.Staff.create(payload, userId);
      console.log("Staff created successfully in database:", response);
      await addStaffToHospital(userId, payload.hospital_id);
    } catch (error) {
      console.error("Error saving user to database:", error);
      toast.error("Failed to save staff details.");
    }
  };
  
  const addStaffToHospital = async (userId: string, hospital_id: string) => {
    try {
      const result = await db.Hospital.get(hospital_id);
      const staffIds = result.staff ? [...result.staff, userId] : [userId];
  
      const response = await db.Hospital.update(hospital_id, { staff: staffIds });
      console.log("Staff added to hospital:", response);
    } catch (error) {
      console.error("Error adding staff to hospital:", error);
      toast.error("Failed to update hospital records.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle>Staff Registration</DialogTitle>
        </DialogHeader>
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
                    <Input placeholder="Enter your email" {...field} />
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
                    <Input placeholder="Enter your name" {...field} />
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
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
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
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a hospital" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hospitals?.map((hospital) => (
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
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
