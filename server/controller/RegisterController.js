import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import UserModel from '../models/User.js';
const RegisterController = async(req,res)=>{
try {
   const{username,email,password,confirmPassword,phoneNumber} = req.body;

   const hashedPassword = await bcrypt.hash(password,10);
     const newUser = {
      username,
      email,
      password:hashedPassword,
      confirmPassword,
      phoneNumber
     }

     const addUser = await UserModel.create(newUser)

     return res.status(201).json({
      addUser
     })

} catch (error) {
   return res.status(500).json({
      "msg": "server error"
   })
    
}
}

export default RegisterController