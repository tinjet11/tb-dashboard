import { Administration } from "@/appwrite/model";
import { columns } from "./column";
import { parseISO, addDays, isWithinInterval, startOfDay } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { toZonedTime } from "date-fns-tz";

type HibernationPeriodTableProps = {
  administrationList: Administration[];
};

const HibernationPeriodTable = ({
  administrationList,
}: HibernationPeriodTableProps) => {
  // Current date
  function isDateWithinTwoDays(recordDatetime: string) {
    const today = startOfDay(new Date()); // Normalize today's date to start of the day
    const startDate = startOfDay(toZonedTime(parseISO(recordDatetime), "UTC")); // Normalize the record date to start of the day
    const endDate = startOfDay(addDays(startDate, 2)); // Add 2 days to the start date and normalize

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Today:", today);

    return isWithinInterval(today, { start: startDate, end: endDate });
  }

  const displayedData = administrationList.filter(
    (value) =>
      value.record != null &&
      value.analysis == null &&
      isDateWithinTwoDays(value.record.datetime)
  );

  return (
    <>
      {/* Display the appropriate data in the table */}
      <div className="bg-white p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Patient in hibernation period:
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

export default HibernationPeriodTable;
