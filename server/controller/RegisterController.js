import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import { generateOtp, hashOtp } from "../utils/generateOtp.js";
import { sendOtpEmail } from "../services/sendOtpEmail.js";

const RegisterController = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      phoneNumber,
      country
    } = req.body;

    if (!username || !email || !password || !country) {
      return res.status(400).json({
        msg: "Required fields are missing"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingEmail = await UserModel.findOne({
      email: normalizedEmail
    });

    if (existingEmail) {
      return res.status(409).json({
        msg: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOtp();

    const newUser = {
      username,
      email: normalizedEmail,
      password: hashedPassword,
      phoneNumber,
      country,
      provider: "local",

      isEmailVerified: false,

      emailVerificationOtp: hashOtp(otp),

      emailVerificationExpires: new Date(
        Date.now() + 5 * 60 * 1000
      ),

      emailVerificationAttempts: 0
    };

    const addUser = await UserModel.create(newUser);

    // Send OTP to email
    try {
      await sendOtpEmail(addUser.email, otp);
    } catch (mailError) {
      console.error("OTP sending error:", mailError);

      return res.status(503).json({
        msg: "Account created, but OTP email could not be sent",
        requiresVerification: true
      });
    }

    return res.status(201).json({
      msg: "Registration successful. OTP sent to email",
      requiresVerification: true,
      email: addUser.email
    });

  } catch (error) {
    console.error("Register error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        msg: "Email already exists"
      });
    }

    return res.status(500).json({
      msg: "Server error"
    });
  }
};

export default RegisterController;