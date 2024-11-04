import { create } from "zustand";
import { Models } from "appwrite";
import { Query } from "appwrite";
import db from "@/appwrite/databases";

interface HospitalState {
  hospitals: Models.Document[];
  isLoading: boolean;
  error: string | null;
  fetchHospitals: () => Promise<void>;
  fetchHospitalObject: (id: string) => Promise<Models.Document | undefined>;
}

export const useHospitalStore = create<HospitalState>((set) => ({
  hospitals: [],
  isLoading: false,
  error: null,

  fetchHospitals: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await db.Hospital.list([Query.orderDesc("$createdAt")]);
      set({ hospitals: response.documents, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch hospital data:", error);
      set({ error: "Failed to fetch hospital data", isLoading: false });
    }
  },

  fetchHospitalObject: async (id: string) => {
    // set({ isLoading: true, error: null });
    try {
      const response = await db.Hospital.get(id);
      return response;
    } catch (error) {
      console.error("Failed to fetch hospital data:", error);
    }
  },
}));
