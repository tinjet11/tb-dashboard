import { Administration } from "@/appwrite/model";
import { columns } from "./column";
import { DataTable } from "@/components/ui/data-table";

type AnalysisTableProps = {
  administrationList: Administration[];
};

const AnalysisTable = ({ administrationList }: AnalysisTableProps) => {
  const pendingData = administrationList.filter(
    (value) => value.record != null && value.analysis != null
  );

  return (
    <>
      {/* Display the appropriate data in the table */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Patient that have done assessment:
          </span>
          <div className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
            {pendingData.length}
          </div>
        </div>
        <DataTable columns={columns} data={pendingData} />
      </div>
    </>
  );
};

export default AnalysisTable;
