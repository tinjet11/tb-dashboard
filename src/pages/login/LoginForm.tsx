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
import { Mail, Lock } from "lucide-react"; // Adjust icon import

import { ForgetPasswordDialog } from "./ForgetPasswordDialog";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function StaffLoginForm() {
  //const { login, isLogin } = useAuth();
  const { login, isLoginLoading } = useAuthStore(/* (state) => ({
    login: state.login,
    isLogin: state.isLogin,
  }) */);
   const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await login(values.email, values.password); // Await the login call

    if (result) { // Assuming login returns an object with a success property
      navigate('/'); // Navigate only on successful login
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Login
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-400" />
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="border-gray-300"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <a
              onClick={() => setIsDialogOpen(true)}
              className="inline-block py-2 mt-2 hover:underline text-blue-600 transition-colors cursor-pointer text-sm"
            >
              Forget Password
            </a>

            <Button
              type="submit"
              className="w-full py-3 mt-4 text-white rounded-md font-medium transition duration-200"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner-border animate-spin w-4 h-4 border-2 border-t-transparent border-white rounded-full"></span>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </div>

      <ForgetPasswordDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
