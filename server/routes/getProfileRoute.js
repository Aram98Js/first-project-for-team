import express from "express";
import authMiddleware from "../auth/authMiddleware.js";
import GetProfileController from "../controller/GetProfileController.js";

const getUserProfileRouter = express.Router();
getUserProfileRouter.get("/api/profile",authMiddleware,GetProfileController)
export default getUserProfileRouter