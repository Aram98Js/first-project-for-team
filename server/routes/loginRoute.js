import express from 'express';
import LoginController from '../controller/LoginController.js';


const loginRouter = express.Router();
loginRouter.post("/api/login",LoginController)
export default loginRouter