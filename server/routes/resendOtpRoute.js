import express from 'express'
import ResendOtpController from '../controller/ResendOtpController.js'

const resendOtpRouter = express.Router();
resendOtpRouter.post("/api/resend-otp",ResendOtpController)
export default resendOtpRouter