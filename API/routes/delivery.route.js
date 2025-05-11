import express from "express";
import {
  viewAssignedDeliveries,
  updateDeliveryStatus,
} from "../controllers/delivery.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";
const router = express.Router();

// Route to view assigned deliveries for the delivery person
router.get("/assigned", isAuth("delivery"), viewAssignedDeliveries);

// Route to update the delivery status (Picked up, Delivered)
router.patch("/:packageid/status", isAuth("delivery"), updateDeliveryStatus);

export default router;
