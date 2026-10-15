import express from 'express';
import RegisterController from '../controller/RegisterController.js';
import { registerValidator,validationResult } from '../validator/registrationValidator.js';


const registerRouter = express.Router();
registerRouter.post("/api/register",registerValidator,(req,res,next)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    
    }
        next()
} ,
RegisterController)
export default registerRouter