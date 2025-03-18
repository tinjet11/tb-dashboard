// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from "react";

import { PasswordChangeDialog } from "../auth/PasswordChangeDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { useHospitalStore } from "@/store/hospitalStore";

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchHospitalObject } = useHospitalStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hospital, setHospital] = useState<any>();

  useEffect(() => {
    // Call getHospitalObj when the component mounts or user.prefs.hospital changes
    if (user?.prefs?.hospital) {
      getHospitalObj();
    }
  }, [user?.prefs?.hospital]);

  async function getHospitalObj() {
    try {
      const hospital = await fetchHospitalObject(user.prefs.hospital);
      setHospital(hospital);
    } catch (error) {
      console.error("Error fetching hospital object:", error);
      setHospital(undefined); // Optional: handle error by setting hospital to undefined
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold">Profile Page</h2>
        {user ? (
          <div className="mt-4 space-y-2">
            {hospital ? (
              <>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.prefs.role || "Undefined"}
                </p>
                <p>
                  <strong>Hospital:</strong> {hospital.name || "Undefined"}
                </p>
              </>
            ) : (
              Array(4)
                .fill(null)
                .map((_, index) => (
                  <Skeleton key={index} className="w-2/3 h-4 bg-gray-300" />
                ))
            )}
            <a
              onClick={() => setIsDialogOpen(true)}
              className="inline-block py-2 mt-2 hover:underline text-blue-600 transition-colors cursor-pointer"
            >
              Change Password
            </a>
          </div>
        ) : (
          Array(4)
            .fill(null)
            .map((_, index) => (
              <Skeleton key={index} className="w-2/3 h-4 bg-gray-300" />
            ))
        )}
      </div>

      {/* Dialog for changing password */}
      <PasswordChangeDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default ProfilePage;
