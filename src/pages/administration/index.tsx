import { useEffect, useState } from "react";
import { columns, Payment } from "./column";
import { DataTable } from "./data-table";
import { Skeleton } from "@/components/ui/skeleton";

function Home() {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  async function getData(): Promise<Payment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
          },
          // Additional data here
        ]);
      }, 500); // 2-second delay
    });
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const fetchedData = await getData();
      setData(fetchedData);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="container p-4">
      {loading ? (
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-[20px] mb-2" />
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <h2>Today Administration</h2>
              <p>Current Queue: Q0001</p>
            </div>

            <DataTable columns={columns} data={data} />
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
