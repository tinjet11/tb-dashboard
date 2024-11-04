import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Client, Account, ID } from "appwrite";
import toast from "react-hot-toast";
import { EncryptedStorage } from "../lib/encryption";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
interface AuthState {
  user: any;
  isLoading: boolean;
  isLoginLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  recoverPassword: (
    userId: string,
    secret: string,
    newPassword: string
  ) => Promise<boolean>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
}

// Create Zustand store with persist middleware
export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      prefs: null,
      isLoading: false,
      isLoginLoading: false,

      checkAuthStatus: async () => {
        set({ isLoading: true });
        try {
          console.log("test");
          const session = await account.get();
          set({ user: session });
        } catch (error) {
          set({ user: null });
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoginLoading: true });
        try {
          await account.createEmailPasswordSession(email, password);
          const userData = await account.get();
          set({ user: userData });
          toast.success("Login successful");
          return true;
        } catch (error) {
          console.error("Login failed", error);
          toast.error("Login failed. Please check your credentials.");
          throw error;
        } finally {
          set({ isLoginLoading: false });
        }
      },

      logout: async () => {
        try {
          await account.deleteSession("current");
          toast.success("Logged out successfully");
          set({ user: null });
          return true;
        } catch (error) {
          console.error("Logout failed", error);
          toast.error("Failed to log out");
          return false;
        }
      },

      updatePassword: async (oldPassword, newPassword) => {
        try {
          await account.updatePassword(newPassword, oldPassword);
          toast.success("Password Updated Successfully");
        } catch (error) {
          toast.error("Failed to update password. Please try again.");
          console.error("Password Update Failed:", error);
        }
      },

      recoverPassword: async (userId, secret, newPassword) => {
        try {
          await account.updateRecovery(userId, secret, newPassword);
          toast.success("Password updated successfully!");
          return true;
        } catch (error) {
          toast.error("Failed to update password. Please try again.");
          console.error("Error updating password:", error);
          return false;
        }
      },

      sendPasswordResetEmail: async (email) => {
        try {
          await account.createRecovery(
            email,
            "http://localhost:5173/recover-password" // URL for the recovery page
          );
          toast.success(
            "Password recovery email sent. Please check your email"
          );
        } catch (error) {
          console.error("Error sending password reset email:", error);
          toast.error("Failed to send password reset email.");
        }
      },
    }),

    {
      name: "auth-storage", // Unique name for the storage key
      storage: new EncryptedStorage(),
    }
  )
);
