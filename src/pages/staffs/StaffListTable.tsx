import { Staff } from "@/appwrite/model";
import { columns } from "./column";
import { DataTable } from "./data-table";



type StaffListProps = {
  staffList: Staff[];
};

const StaffList = ({
  staffList,
}: StaffListProps) => {

  return (
    <>
      {/* Display the appropriate data in the table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <DataTable columns={columns} data={staffList} />
      </div>
    </>
  );
};

export default StaffList;
