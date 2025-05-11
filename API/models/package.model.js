import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    packageSize: {
      type: String,
      required: true,
    },
    packageWeight: {
      type: Number,
      required: true,
    },
    destinationAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Picked up", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
