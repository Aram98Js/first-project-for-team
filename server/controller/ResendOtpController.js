

const ResendOtpController = async(req,res)=>{
 try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        msg: "Email is required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await UserModel.findOne({
      email: normalizedEmail,
      provider: "local",
      isEmailVerified: false
    });

    // Don't reveal whether an email is registered
    if (!user) {
      return res.status(200).json({
        msg: "If verification is pending, a code will be sent"
      });
    }

    // Prevent frequent resend requests
    if (
      user.emailVerificationLastSentAt &&
      Date.now() -
        new Date(user.emailVerificationLastSentAt).getTime() <
        60 * 1000
    ) {
      return res.status(429).json({
        msg: "Please wait before requesting another code"
      });
    }

    const otp = generateOtp();

    user.emailVerificationOtp = hashOtp(otp);

    user.emailVerificationExpires = new Date(
      Date.now() + 5 * 60 * 1000
    );

    user.emailVerificationAttempts = 0;

    user.emailVerificationLastSentAt = new Date();

    await user.save();

    try {
      await sendOtpEmail(user.email, otp);
    } catch (mailError) {
      console.error("Resend OTP email error:", mailError);

      return res.status(503).json({
        msg: "Could not send verification email. Try again later."
      });
    }

    return res.status(200).json({
      msg: "If verification is pending, a code will be sent"
    });

  } catch (error) {
    console.error("Resend OTP error:", error);

    return res.status(500).json({
      msg: "Server error"
    });
  }
}

export default ResendOtpController