import { Patient } from "@/appwrite/model";
import { columns } from "./column";
import { DataTable } from "./data-table";

type PatientListTableProps = {
  patientList: Patient[];
};

const PatientListTable = ({
  patientList,
}: PatientListTableProps) => {

  return (
    <>
      {/* Display the appropriate data in the table */}
      <div className="bg-white p-4 ">
        <DataTable columns={columns} data={patientList} />
      </div>
    </>
  );
};

export default PatientListTable;
