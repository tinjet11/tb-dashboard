// src/components/PasswordChangeDialog.tsx
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
import { Label } from "@/components/ui/label";
import { useState } from "react";
//import { useAuth } from "./AuthContext";
import { useAuthStore } from "@/store/authStore";

export function ForgetPasswordDialog({ isOpen, onOpenChange }: any) {
  const [email, setEmail] = useState("");

  const { sendPasswordResetEmail } = useAuthStore(/* (state) => ({
    sendPasswordResetEmail: state.sendPasswordResetEmail,
  }) */);

    const onResetPassword = (event: React.FormEvent) => {
        event.preventDefault();
        sendPasswordResetEmail(email);
        onOpenChange(false); // Close the dialog after password change
        setEmail("");
    };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] py-16">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your registered email address.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onResetPassword}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="string"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Reset</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
