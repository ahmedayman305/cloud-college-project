import Package from "../models/package.model.js";
import { throwError } from "../utils/utils.js";

// View Assigned Deliveries
export const viewAssignedDeliveries = async (req, res, next) => {
  try {
    // Fetch all packages assigned to the delivery person (based on user ID from the JWT token)
    const deliveries = await Package.find({ deliveryPerson: req.user._id });

    // If no deliveries are found, throw a not found error
    if (deliveries.length === 0) {
      return next(throwError(404, "No deliveries assigned"));
    }

    // Return the list of assigned deliveries
    res.status(200).json({
      success: true,
      deliveries, // List of deliveries assigned to the current user
    });
  } catch (err) {
    next(err); // Pass error to error handler middleware
  }
};

export const updateDeliveryStatus = async (req, res, next) => {
  const { packageid } = req.params; // Package ID from URL params
  const { status } = req.body; // New status (e.g., "Picked up", "Delivered")

  try {
    // Validate the incoming status to make sure it's one of the accepted statuses
    if (!["Pending", "Picked up", "Delivered"].includes(status)) {
      return next(
        throwError(
          400,
          "Invalid status. Valid statuses are: Pending, Picked up, Delivered"
        )
      );
    }

    // Find the package by its ID
    const deliveryPackage = await Package.findById(packageid); // Changed `package` to `deliveryPackage`

    // If the package doesn't exist, throw a not found error
    if (!deliveryPackage) {
      // Changed `package` to `deliveryPackage`
      return next(throwError(404, "Package not found"));
    }

    // Check if the logged-in user is the assigned delivery person for the package
    if (deliveryPackage.deliveryPerson.toString() !== req.user._id.toString()) {
      // Changed `package` to `deliveryPackage`
      return next(throwError(403, "You are not assigned to this delivery"));
    }

    // Update the status of the package
    deliveryPackage.status = status; // Changed `package` to `deliveryPackage`

    // Save the updated package back to the database
    await deliveryPackage.save(); // Changed `package` to `deliveryPackage`

    // Respond with the updated package details
    res.status(200).json({
      success: true,
      message: `Package status updated to ${status}`,
      package: deliveryPackage, // Changed `package` to `deliveryPackage`
    });
  } catch (err) {
    next(err); // Pass error to error handler middleware
  }
};
