
import UserModel from "../models/User.js"

const GetProfileController = async (req,res)=>{
try {
  const user = await UserModel.findById(req.user.id).select("-password")
  if(!user){
    return res.status(404).json({
        msg:"user not found"
    })
  }


  return res.status(200).json({
    user
  }) 
} catch (error) {
return res.status(500).json({
    "msg":"Server Error"
})    
}
}

export default GetProfileController