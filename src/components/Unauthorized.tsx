import { Button } from "@/components/ui/button";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">401</h1>
      <h2 className="mt-4 text-2xl font-semibold">Unauthorized Access</h2>
      <p className="mt-2 text-gray-600">
        You must be logged in to view this page.
      </p>
      <a href="/login" className="mt-4">
        <Button>Login</Button>
      </a>
    </div>
  );
};

export default Unauthorized;
