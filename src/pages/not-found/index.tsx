const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Oops! Page Not Found</h2>
      <p className="mt-2 text-gray-600">
        The page you are looking for does not exist. It might have been removed
        or the URL might be incorrect.
      </p>
      <a
        href="/"
        className="mt-6 inline-block px-6 py-2"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;
