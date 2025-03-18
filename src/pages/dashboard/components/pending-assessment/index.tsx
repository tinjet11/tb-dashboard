import { Administration } from "@/appwrite/model";
import { columns } from "./column";
import { parseISO, addDays, isWithinInterval, startOfDay } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { toZonedTime } from "date-fns-tz";

type PendingAssessmentTableProps = {
  administrationList: Administration[];
};

const PendingAssessmentTable = ({
  administrationList,
}: PendingAssessmentTableProps) => {
   // Current date
   function isAssessmentDoneWithinOneDay(recordDatetime: string) {
    const today = startOfDay(new Date()); // Normalize today's date to start of the day
    const startDate = startOfDay(addDays(toZonedTime(parseISO(recordDatetime), "UTC"), 2)); // Normalize the record date to start of the day
    const endDate = startOfDay(addDays(startDate, 3)); // Add 2 days to the start date and normalize

    return isWithinInterval(today, { start: startDate, end: endDate });
  }

  const displayedData = administrationList.filter((value)=> (value.record != null && value.analysis == null && isAssessmentDoneWithinOneDay(value.record.datetime)));

  return (
    <>
      {/* Display the appropriate data in the table */}
      <div className="bg-white p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Patient in pending self-assessment:
          </span>
          <div className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
            {displayedData.length}
          </div>
        </div>
        <DataTable columns={columns} data={displayedData} />
      </div>
    </>
  );
};

export default PendingAssessmentTable;
