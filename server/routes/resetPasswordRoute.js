import express from "express"
import ResetPasswordController from "../controller/ResetPasswordController";

const resetPasswordRouter = express.Router();
resetPasswordRouter.patch('/api/resetPassword/:token',ResetPasswordController)

export default resetPasswordRouter