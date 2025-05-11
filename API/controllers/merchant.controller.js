import Package from "../models/package.model.js";
import User from "../models/user.model.js"; // Assuming you have a User model

export const createAndAssignPackage = async (req, res, next) => {
  const { packageSize, packageWeight, destinationAddress, deliveryPersonId } =
    req.body;

  try {
    // Validate required fields
    if (
      !packageSize ||
      !packageWeight ||
      !destinationAddress ||
      !deliveryPersonId
    ) {
      return next(
        throwError(
          400,
          "All fields are required: packageSize, packageWeight, destinationAddress, and deliveryPersonId"
        )
      );
    }

    // Check if the delivery person exists and is a valid user (e.g., role 'delivery')
    const deliveryPerson = await User.findById(deliveryPersonId);
    if (!deliveryPerson) {
      return next(throwError(404, "Delivery person not found"));
    }

    // Optionally, check if the user has a valid role (e.g., 'delivery')
    if (!deliveryPerson.role || deliveryPerson.role !== "delivery") {
      return next(throwError(403, "The user is not a valid delivery person"));
    }

    // Create a new package
    const newPackage = new Package({
      merchant: req.user._id, // Assuming the merchant is the logged-in user
      deliveryPerson: deliveryPersonId,
      packageSize,
      packageWeight,
      destinationAddress,
      status: "Pending", // Initially, the status will be "Pending"
    });

    // Save the new package
    await newPackage.save();

    // Respond with the newly created package details
    res.status(201).json({
      message: "Package created and assigned successfully",
      package: newPackage,
    });
  } catch (error) {
    next(error);
  }
};

export const indexDeliveryPerson = async (req, res, next) => {
  try {
    // Query the database to get all users with the 'delivery' role
    const deliveryPersons = await User.find({ role: "delivery" }).select(
      "-password"
    );

    if (deliveryPersons.length === 0) {
      return next(throwError(404, "No delivery persons found"));
    }

    // Return the list of delivery persons
    res.status(200).json({
      success: true,
      deliveryPersons,
    });
  } catch (err) {
    next(err);
  }
};
