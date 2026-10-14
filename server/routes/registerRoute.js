import express from 'express';
import RegisterController from '../controller/RegisterController.js';


const registerRouter = express.Router();
registerRouter.post("/api/register",RegisterController)
export default registerRouter