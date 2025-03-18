import db from "@/appwrite/databases";
import { Patient, Transformation } from "@/appwrite/model";
import { useAuthStore } from "@/store/authStore";
import React, { useEffect, useState, useCallback } from "react";
import PatientListTable from "./PatientListTable";
import { PatientRegisterForm } from "./PatientRegisterForm";
import LoadingPage from "@/components/LoadingPage";
import { Separator } from "@/components/ui/separator";

const PatientList = () => {
  const transformer = new Transformation();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [patientList, setPatientList] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null); // Track errors

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const hospitalId = user?.prefs?.hospital;
      if (!hospitalId) {
        throw new Error("No hospital assigned.");
      }

      const result = await db.Hospital.get(hospitalId);
      setPatientList(transformer.transformToPatientsList(result.patient));
    } catch (error) {
      setError("Failed to fetch patient data. Please try again.");
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.prefs?.hospital]); // Added dependency

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependency ensures fetch only when needed

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-900  min-h-screen">
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <LoadingPage message="Loading patients..." />
        </div>
      ) : error ? (
        <div className="h-screen flex items-center justify-center">
          <p className="text-center text-red-500 text-lg font-medium">
            {error}
          </p>
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Patient List
            </h2>
            <PatientRegisterForm />
          </div>

          <Separator className="mb-6" />

          {/* Patient Number */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Total Patients:
            </span>
            <div className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
              {patientList.length}
            </div>
          </div>

          {/* Table Section */}
          <PatientListTable patientList={patientList} />
        </>
      )}
    </div>
  );
};

export default PatientList;
