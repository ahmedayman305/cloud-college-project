import { Toaster } from "react-hot-toast"; // Import Toaster
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import MerchantDashboard from "./pages/merchant/Dashboard";
import DeliveryDashboard from "./pages/delivery/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/merchant"
            element={
              <PrivateRoute>
                <MerchantDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/delivery"
            element={
              <PrivateRoute>
                <DeliveryDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <Toaster /> {/* Include Toaster to display notifications */}
    </Router>
  );
}

export default App;
