import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import UserModel from "../models/User";


const LoginController = async(req,res)=>{
    try {
       
        const {email,password} = req.body;
const findUser = await UserModel.findOne({email});


if (!findUser) {
    return res.status(404).json({
        "msg": "user not found"
    })
}

const comparedPassword = await bcrypt.compare(password, findUser.password);
if(!comparedPassword){
    return res.status(400).json({
        "msg":"wrong password"
    })
}

const accessToken = jwt.sign(
{
id: findUser._id,
username: findUser.username,
email: findUser.email,
role: findUser.role
},
process.env.SECRET,
{
    expiresIn: "1d"
}
)


const refreshToken = jwt.sign(
    {
id: findUser._id,
username: findUser.username,
email: findUser.email,
role: findUser.role

    },
    process.env.REFRESH_SECRET,
    {
        expiresIn:"7d"
    }
)


        return res.json({
        accessToken,
        user:{
          _id: findUser._id,
          username: findUser.username,
           email:findUser.email,
        role:findUser.role,
        image: findUser.image
        },
        refreshToken
    });


    } catch (error) {
        return res.status(500).json({
            "msg":"Server error"
        })
    }

}

export default LoginController