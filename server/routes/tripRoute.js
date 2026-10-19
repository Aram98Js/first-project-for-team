import express from "express";
import authMiddleware from "../auth/authMiddleware.js";
import { createTrip, getMyTrips, getTripById } from "../controller/tripController.js";

const createTripRouter = express.Router();
const getMyTripsRouter = express.Router();
const getTripRouter = express.Router();

createTripRouter.post("/api/createTrip", authMiddleware, createTrip);
getMyTripsRouter.get("/api/getMyTrip", authMiddleware, getMyTrips);
getTripRouter.get("/api/getTrip/:id", authMiddleware, getTripById);

export{createTripRouter,getTripRouter,getMyTripsRouter};