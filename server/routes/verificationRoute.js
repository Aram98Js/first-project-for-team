import VerifyEmailController from "../controller/VerifyEmailController.js"
import express from 'express'
const verifyRouter = express.Router();
verifyRouter.post("/api/verify-email",VerifyEmailController)
export default  verifyRouter
