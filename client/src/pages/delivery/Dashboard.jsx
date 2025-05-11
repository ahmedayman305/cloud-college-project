import React, { useState, useEffect } from "react";
import axiosInstance from "../../lib/axios"; // Ensure axiosInstance is properly imported
import { CheckCircle, Clock, Truck } from "lucide-react"; // Import the icons

function DeliveryDashboard() {
  const [assignedDeliveries, setAssignedDeliveries] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch assigned deliveries on component mount
  useEffect(() => {
    const fetchAssignedDeliveries = async () => {
      try {
        // Making the API call to fetch assigned deliveries
        const response = await axiosInstance.get("/delivery/assigned");
        setAssignedDeliveries(response.data.deliveries); // Assuming the API response contains a 'deliveries' key
      } catch (err) {
        setError("Failed to fetch assigned deliveries.");
      }
    };

    fetchAssignedDeliveries();
  }, []);

  // Handle delivery status update
  const handleStatusUpdate = async (deliveryId, newStatus) => {
    setError("");
    setSuccess("");

    try {
      // Sending a request to update the status of the delivery
      const response = await axiosInstance.patch(
        `/delivery/${deliveryId}/status`,
        { status: newStatus }
      );

      // If the status update is successful
      setSuccess(response.data.message);

      // Update the status of the delivery in the local state after successful update
      setAssignedDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) =>
          delivery.id === deliveryId
            ? { ...delivery, status: newStatus }
            : delivery
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update delivery status."
      );
    }
  };

  // Function to get the icon and styles based on status
  const getStatusIconAndStyles = (status) => {
    switch (status) {
      case "Pending":
        return {
          icon: <Clock className="text-yellow-500" size={24} />,
          text: "Pending",
          color: "text-yellow-500",
          bgColor: "bg-yellow-100",
        };
      case "Picked up":
        return {
          icon: <Truck className="text-blue-500" size={24} />,
          text: "Picked up",
          color: "text-blue-500",
          bgColor: "bg-blue-100",
        };
      case "Delivered":
        return {
          icon: <CheckCircle className="text-green-500" size={24} />,
          text: "Delivered",
          color: "text-green-500",
          bgColor: "bg-green-100",
        };
      default:
        return {
          icon: null,
          text: "Unknown",
          color: "text-gray-500",
          bgColor: "bg-gray-100",
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 p-8 bg-white shadow-xl rounded-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Assigned Deliveries
      </h2>

      {error && (
        <div className="text-red-600 font-medium text-center mb-6 p-4 bg-red-100 rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-600 font-medium text-center mb-6 p-4 bg-green-100 rounded-xl">
          {success}
        </div>
      )}

      {assignedDeliveries.length === 0 ? (
        <p className="text-center text-gray-500">No assigned deliveries.</p>
      ) : (
        <div className="space-y-8">
          {assignedDeliveries.map((delivery) => {
            const { icon, text, color, bgColor } = getStatusIconAndStyles(
              delivery.status
            );

            return (
              <div
                key={delivery.id}
                className="p-8 bg-gray-50 shadow-2xl rounded-2xl transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {`Delivery #${delivery._id}`}
                    </h3>
                    <p className="text-sm text-gray-600">{`Package: ${delivery.packageSize}`}</p>
                    <p className="text-sm text-gray-600">{`Weight: ${delivery.packageWeight} kg`}</p>
                    <p className="text-sm text-gray-600">{`Address: ${delivery.destinationAddress}`}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex items-center px-4 py-2 rounded-xl ${bgColor}`}
                    >
                      {icon}
                      <p className={`ml-2 text-lg font-medium ${color}`}>
                        {text}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-6">
                  <button
                    onClick={() =>
                      handleStatusUpdate(delivery._id, "Delivered")
                    }
                    className="w-36 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(delivery._id, "Picked up")
                    }
                    className="w-36 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Picked up
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(delivery._id, "Pending")}
                    className="w-36 bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    Pending
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DeliveryDashboard;
