import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const PasswordRecovery = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { recoverPassword } =
    useAuthStore(/* (state) => ({
    recoverPassword: state.recoverPassword,
  }) */);
  const query = new URLSearchParams(useLocation().search);
  const navigate = useNavigate();

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    const userId = query.get("userId");
    const secret = query.get("secret");
    if (!userId || !secret) {
      toast.error("Invalid Action");
      return;
    }
    const result = await recoverPassword(userId, secret, newPassword);
    if (result) {
      navigate("/login");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[380px] rounded-lg shadow-lg border border-gray-200 bg-white p-6">
        <CardHeader className="mb-4">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Password Recovery
          </CardTitle>
          <CardDescription className="text-gray-600">
            Create a new password to recover your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange}>
            <div className="grid gap-5">
              <div className="flex flex-col">
                <Label
                  htmlFor="newPassword"
                  className="text-gray-700 font-medium"
                >
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border border-gray-300 rounded-md mt-2 p-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-700 font-medium"
                >
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-gray-300 rounded-md mt-2 p-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <CardFooter className="flex justify-end mt-6">
              <Button
                type="submit"
                className="text-white font-medium py-2 rounded-lg transition-colors"
              >
                Save changes
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordRecovery;
