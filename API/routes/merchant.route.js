import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import {
  createAndAssignPackage,
  indexDeliveryPerson,
} from "../controllers/merchant.controller.js";

const router = express.Router();

router.post("/assign-task", isAuth("merchant"), createAndAssignPackage);
router.get("/index-delivery-person", isAuth("merchant"), indexDeliveryPerson);

export default router;
