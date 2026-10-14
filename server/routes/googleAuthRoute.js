import express from "express";
import GoogleController from "../controller/GoogleAuthController.js";

const googleRouter = express.Router();

googleRouter.post("/api/auth/google", GoogleController);

export default googleRouter;