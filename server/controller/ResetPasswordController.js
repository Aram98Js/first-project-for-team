import crypto from "node:crypto";
import bcrypt from "bcrypt";

const ResetPasswordController = async (req,res)=>{
try {

    const { token } = req.params;
    const {newPassword,confirmNewPassword} = req.body;
    

   if (!newPassword || !confirmNewPassword) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }


    if(newPassword !== confirmNewPassword){
        return res.status(400).json({
            msg:"Passwords do not match",
        })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters",
      });
    }

    // 4. Hash ենք անում URL-ից ստացած token-ը
    if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        msg: "Invalid or expired reset token",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

   
    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
      provider: "local",
    });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid or expired reset token",
      });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

  
    const result = await UserModel.updateOne(
      {
        _id: user._id,
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
      },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      }
    );

    if (result.modifiedCount !== 1) {
      return res.status(400).json({
        msg: "Invalid or expired reset token",
      });
    }

    return res.status(200).json({
      msg: "Password reset successfully",
    });


} catch (error) {
      console.error("Reset password error:", error);

    return res.status(500).json({
      msg: "Internal server error",  
    })
}
}

export default ResetPasswordController