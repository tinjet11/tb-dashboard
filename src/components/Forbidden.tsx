const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
      <h2 className="mt-4 text-2xl font-semibold">Access Denied</h2>
      <p className="mt-2 text-gray-600">
        You do not have permission to view this page.
      </p>
      <a href="/" className="mt-4">
        Go To Home Page
      </a>
    </div>
  );
};

export default Forbidden;
