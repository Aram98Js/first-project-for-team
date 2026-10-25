import express from "express";
import authMiddleware from "../auth/authMiddleware.js";
import {
  createTrip,
  getMyTrips,
  getTripById,
  deleteTrip,
} from "../controller/tripController.js";

const router = express.Router();

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getMyTrips);
router.get("/:id", authMiddleware, getTripById);
router.delete("/:id", authMiddleware, deleteTrip);

export default router;