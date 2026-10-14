import express from 'express';
import LoginController from '../controller/LoginController';


const loginRouter = express.Router();
loginRouter.post("/api/login",LoginController)