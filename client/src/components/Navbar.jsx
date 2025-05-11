const Navbar = () => {
  const handleLogout = () => {
    // Example logout logic — customize as needed
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login or home
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">DeliveryApp</div>
        <div className="space-x-4 flex items-center">
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
