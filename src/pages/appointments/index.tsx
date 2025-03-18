import db from "@/appwrite/databases";
import { Administration, Patient, Transformation } from "@/appwrite/model";
import { useAuthStore } from "@/store/authStore";
import React, { useEffect, useState } from "react";
import AppointmentTable from "./AppointmentTable";
import { Query } from "appwrite";
import { AdministrationFormDialog } from "./AdministrationForm";
import LoadingPage from "@/components/LoadingPage";
import { Separator } from "@/components/ui/separator";

const AppointmentList = () => {
  const transformer = new Transformation();
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const [administrationList, setAdministrationList] = useState<
    Administration[]
  >([]);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const hospitalId = user?.prefs?.hospital;
        console.log(hospitalId);
        const result = await db.Hospital.get(hospitalId);
        const patientList = transformer.transformToPatientsList(result.patient);

        //list of patient object
        const patientIds = patientList.map((patient) => patient.id);

        console.log(result.patient);

        const administrationList = await getAdministrations(patientIds);
        setAdministrationList(administrationList);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  const getAdministrations = async (patientList: string[]) => {
    try {
      const administrationResult = await db.Administration.list([
        Query.equal("patient", patientList),
      ]);
      console.log(administrationResult);

      // Transform the array data into Administration[]
      const transformedAdministrationList =
        transformer.transformToAdministrationList(
          administrationResult.documents
        );

      console.log(
        "Transformed Administration List:",
        transformedAdministrationList
      );
      return transformedAdministrationList;
    } catch (error) {
      console.log("Fail during getting administration result", error);
      return [];
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-900  min-h-screen">
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <LoadingPage message="Loading appointments..." />
        </div> /* : error ? (
      <div className="h-screen flex items-center justify-center">
        <p className="text-center text-red-500 text-lg font-medium">{error}</p>
      </div>
    ) */
      ) : (
        <>
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              Appointment List
            </h2>
            <AdministrationFormDialog />
          </div>
          <Separator className="mb-6" />

          {/* Table Section */}
          <AppointmentTable administrationList={administrationList} />
        </>
      )}
    </div>
  );
};

export default AppointmentList;
