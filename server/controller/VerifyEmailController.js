

import UserModel from "../models/User.js";
import { hashOtp } from "../utils/generateOtp.js";

const VerifyEmailController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        msg: "Email and 6-digit OTP are required"
      });
    }

    const user = await UserModel.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user || user.isEmailVerified) {
      return res.status(400).json({
        msg: "Invalid verification request"
      });
    }

    if (user.emailVerificationAttempts >= 5) {
      return res.status(429).json({
        msg: "Too many attempts. Request a new code."
      });
    }

    if (
      !user.emailVerificationExpires ||
      new Date(user.emailVerificationExpires).getTime() <= Date.now()
    ) {
      return res.status(400).json({
        msg: "OTP expired"
      });
    }

    const hashedOtp = hashOtp(String(otp));

    if (user.emailVerificationOtp !== hashedOtp) {
      user.emailVerificationAttempts += 1;
      await user.save();

      return res.status(400).json({
        msg: "Invalid OTP"
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationOtp = null;
    user.emailVerificationExpires = null;
    user.emailVerificationAttempts = 0;

    await user.save();

    return res.status(200).json({
      msg: "Email verified successfully"
    });

  } catch (error) {
    console.error("Verify email error:", error);

    return res.status(500).json({
      msg: "Server error"
    });
  }
};

export default VerifyEmailController;