import express from "express";
import authMiddleware from "../auth/authMiddleware.js";
import { createTrip, getMyTrips, getTripById } from "../controller/tripController.js";

const router = express.Router();

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getMyTrips);
router.get("/:id", authMiddleware, getTripById);

export default router;