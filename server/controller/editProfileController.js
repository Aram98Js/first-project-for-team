import UserModel from "../models/User.js";

const EditProfileController = async(req,res)=>{
try {
    const userId = req.user.id;
  const {username,country,phoneNumber} = req.body;
const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    {
        $set:{
            ...(username!==undefined && {username}),
            ...(country!==undefined && {country}),
            ...(phoneNumber!==undefined&& {phoneNumber}),
        }
    },
    {
        new: true,
        runValidators: true
    }
).select(
      "-password -emailVerificationOtp -resetPasswordToken"
    );



    if (!updatedUser) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    return res.status(200).json({
      msg: "Profile updated successfully",
      user: updatedUser,
    });
} catch (error) {
    console.error(error);

    return res.status(500).json({
      msg: "Failed to update profile",
    }); 
}
}

export default EditProfileController