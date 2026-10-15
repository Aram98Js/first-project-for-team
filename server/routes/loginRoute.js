import express from 'express';
import LoginController from '../controller/LoginController.js';
import { loginValidator, validationResult } from '../validator/loginValidator.js';


const loginRouter = express.Router();
loginRouter.post("/api/login",loginValidator,(req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    }
    next()
},
LoginController)
export default loginRouter