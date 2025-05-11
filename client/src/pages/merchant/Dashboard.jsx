import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios"; // Import the axiosInstance
import { toast } from "react-hot-toast"; // Import toast

function MerchantDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [deliveryForm, setDeliveryForm] = useState({
    package_size: "",
    package_weight: "",
    address: "",
    delivery_person_id: "",
  });
  // Fetch delivery persons to show in the form
  useEffect(() => {
    const fetchDeliveryPersons = async () => {
      try {
        const response = await axiosInstance.get(
          "/merchant/index-delivery-person"
        );
        setDeliveries(response.data.deliveryPersons); // Assuming the response contains delivery persons
      } catch (err) {
        toast.error("Failed to fetch delivery persons");
      }
    };

    fetchDeliveryPersons();
  }, []);

  const handleDeliveryChange = (e) => {
    setDeliveryForm({ ...deliveryForm, [e.target.name]: e.target.value });
  };

  const handleAssignDelivery = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/merchant/assign-task", {
        packageSize: deliveryForm.package_size,
        packageWeight: deliveryForm.package_weight,
        destinationAddress: deliveryForm.address,
        deliveryPersonId: deliveryForm.delivery_person_id,
      });

      // Show success notification
      toast.success(res.data.message);

      // Reset form after successful submission
      setDeliveryForm({
        package_size: "",
        package_weight: "",
        address: "",
        delivery_person_id: "",
      });
    } catch (err) {
      // Show error notification
      toast.error(err.response?.data?.message || "Failed to assign delivery");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Merchant Dashboard
      </h2>

      {/* Assign Delivery Form */}
      <h3 className="text-xl font-semibold mb-4">Assign a Delivery</h3>
      <form onSubmit={handleAssignDelivery} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Package Size</label>
          <input
            type="text"
            name="package_size"
            value={deliveryForm.package_size}
            onChange={handleDeliveryChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            placeholder="Enter package size"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Package Weight</label>
          <input
            type="text"
            name="package_weight"
            value={deliveryForm.package_weight}
            onChange={handleDeliveryChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            placeholder="Enter package weight"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={deliveryForm.address}
            onChange={handleDeliveryChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            placeholder="Enter delivery address"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Select Delivery Person
          </label>
          <select
            name="delivery_person_id"
            value={deliveryForm.delivery_person_id}
            onChange={handleDeliveryChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select Delivery Person</option>
            {deliveries.length > 0 ? (
              deliveries.map((delivery) => (
                <option key={delivery._id} value={delivery._id}>
                  {`${delivery.fullname}`}{" "}
                  {/* Assuming 'fullname' and '_id' exist for delivery person */}
                </option>
              ))
            ) : (
              <option disabled>No delivery persons available</option>
            )}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Assign Delivery
        </button>
      </form>
    </div>
  );
}

export default MerchantDashboard;
