import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Redirect to login page if no token exists
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If role is not valid, redirect to login page
  if (role !== "merchant" && role !== "delivery") {
    return <Navigate to="/login" />;
  }

  // Allow access if role is valid
  return children;
}

export default PrivateRoute;
