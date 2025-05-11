import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast"; // Importing toast

function RegisterPage() {
  const [name, setName] = useState(""); // Separate state for each field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("merchant"); // Default role is "merchant"
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      email,
      password,
      role,
    };

    try {
      // Sending registration request to the backend
      const res = await axiosInstance.post("/auth/register", formData);

      // Check if token and role are present in the response

      // Store token and role in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // Show success toast
      toast.success(res.data.message || "Registration successful!");

      // Redirect based on user role

      navigate("/login");
    } catch (err) {
      // Display error message with toast if registration fails
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              value={name} // Using name for full name
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="merchant">Merchant</option>
              <option value="delivery">Delivery Person</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
