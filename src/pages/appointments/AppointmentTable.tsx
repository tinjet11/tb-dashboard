import { Administration } from "@/appwrite/model";
import { columns } from "./column";
import { format, isAfter, isEqual, parseISO, startOfDay } from "date-fns";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DataTable } from "./data-table";
import { toZonedTime } from "date-fns-tz/toZonedTime";

type AppointmentTableProps = {
  administrationList: Administration[];
};

const AppointmentTable = ({ administrationList }: AppointmentTableProps) => {
  const today = startOfDay(new Date()); // Set today to 00:00:00

  const todayAdministrationList = administrationList.filter((appointment) => {
    const utcDate = parseISO(appointment.appointment_time); // Convert ISO string to Date
    const utcFormattedDate = toZonedTime(utcDate, "UTC"); // Ensure it's in UTC
    return isEqual(startOfDay(utcFormattedDate), today); // ✅ RETURN statement added
  });

  const upcomingAdministrationList = administrationList.filter((appointment) => {
    const utcDate = parseISO(appointment.appointment_time); // Convert ISO string to Date
    const utcFormattedDate = toZonedTime(utcDate, "UTC"); // Ensure it's in UTC
    return isAfter(startOfDay(utcFormattedDate), today); // ✅ RETURN statement added
  });

  const previousAdministrationList = administrationList.filter((appointment) => {
    const utcDate = parseISO(appointment.appointment_time); // Convert ISO string to Date
    const utcFormattedDate = toZonedTime(utcDate, "UTC"); // Ensure it's in UTC
   // return isAfter(startOfDay(utcFormattedDate), today); // ✅ RETURN statement added
    return  !isAfter(startOfDay(utcFormattedDate), today) &&
    !isEqual(startOfDay(utcFormattedDate), today)
  });

  // State to track the displayed data
  const [displayedData, setDisplayedData] = useState(todayAdministrationList);
  const [activeLabel, setActiveLabel] = useState("today");
  const [showAllTables, setShowAllTables] = useState(false);

  const switchAppointmentList = (label: string) => {
    setActiveLabel(label);
    switch (label) {
      case "today":
        setDisplayedData(todayAdministrationList);
        break;
      case "upcoming":
        setDisplayedData(upcomingAdministrationList);
        break;
      case "previous":
        setDisplayedData(previousAdministrationList);
        break;
      default:
        setDisplayedData([]);
        break;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center space-y-4 mx-4">
        <div className="flex space-x-4">
          {!showAllTables &&
            ["today", "upcoming", "previous"].map((label) => (
              <button
                key={label}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeLabel === label
                    ? "bg-green-500 text-white font-bold shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-green-100"
                }`}
                onClick={() => switchAppointmentList(label)}
              >
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </button>
            ))}
        </div>

        <div className="flex items-center space-x-2">
          <Label>View All</Label>
          <Switch checked={showAllTables} onCheckedChange={setShowAllTables} />
        </div>
      </div>

      {/* Conditionally Render Tables */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        {showAllTables ? (
          <>
            <div className="my-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Today Appointment:
                </span>
                <div className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
                  {todayAdministrationList.length}
                </div>
              </div>
              <DataTable columns={columns} data={todayAdministrationList} />
            </div>

            <div className="my-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Upcoming Appointment:
                </span>
                <div className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
                  {upcomingAdministrationList.length}
                </div>
              </div>
              <DataTable columns={columns} data={upcomingAdministrationList} />
            </div>

            <div className="my-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Previous Appointment:
                </span>
                <div className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
                  {previousAdministrationList.length}
                </div>
              </div>

              <DataTable columns={columns} data={previousAdministrationList} />
            </div>
          </>
        ) : (
          <DataTable columns={columns} data={displayedData} />
        )}
      </div>
    </>
  );
};

export default AppointmentTable;
