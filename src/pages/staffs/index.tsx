import db from "@/appwrite/databases";
import { Staff, Transformation } from "@/appwrite/model";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

import { StaffRegisterForm } from "./StaffRegisterForm";
import { Separator } from "@/components/ui/separator";
import StaffListTable from "./StaffListTable";

const StaffList = () => {
  const transformer = new Transformation();
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const hospitalId = user?.prefs?.hospital;
        console.log(hospitalId);
        const result = await db.Hospital.get(hospitalId);
        setStaffList(transformer.transformToStaffsList(result.staff));
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto mt-8 p-6 bg-white  rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Staff List</h2>
        <StaffRegisterForm />
      </div>

      <Separator className="mb-6" />

      {/* Patient Number */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Total Staff:
        </span>
        <div className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
          {staffList.length}
        </div>
      </div>

      <StaffListTable staffList={staffList} />
    </div>
  );
};

export default StaffList;
