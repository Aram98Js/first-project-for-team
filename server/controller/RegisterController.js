import bcrypt from 'bcrypt'
import UserModel from '../models/User.js';
const RegisterController = async(req,res)=>{
try {
   const{username,email,password,phoneNumber,country} = req.body;



   
console.log("Request body:", req.body);

     const existingEmail = await UserModel.findOne({email});
     




     if (existingEmail) {
      return res.status(409).json({
         msg:"email es already exist"
      })
     }

        const hashedPassword = await bcrypt.hash(password,10);
     const newUser = {
      username,
      email,
      password:hashedPassword,
      phoneNumber,
      country
     }

     const addUser = await UserModel.create(newUser)
     return res.status(201).json({
      addUser
     })

} catch (error) {
   console.error("Register error:", error);

  return res.status(500).json({
    msg: "Server error"
  });
    
}
}

export default RegisterController