import express from 'express';
import ForgotPasswordController from '../controller/ForgotPasswordController.js';

const forgotPasswordRouter = express.Router();
forgotPasswordRouter.post("/api/forgotPassword",ForgotPasswordController)
export default forgotPasswordRouter
