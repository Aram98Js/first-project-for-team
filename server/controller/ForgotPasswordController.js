
import crypto from "node:crypto";
import UserModel from "../models/User.js";
import transporter from "../config/mailTransporter.js";

const ForgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        msg: "Email is required",
      });
    }

    const findEmail = await UserModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (findEmail && findEmail.provider === "local") {
      const resetToken = crypto.randomBytes(32).toString("hex");

      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      findEmail.resetPasswordToken = hashedToken;

      findEmail.resetPasswordExpires = new Date(
        Date.now() + 15 * 60 * 1000
      );

      await findEmail.save();

      const resetUrl =
        `http://localhost:5173/reset-password/${resetToken}`;

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: findEmail.email,
          subject: "TripGenius - Reset Your Password",

          html: `
            <div style="
              font-family: Arial, sans-serif;
              max-width: 500px;
              margin: 0 auto;
              padding: 30px;
              background: #ffffff;
            ">
              <h1 style="color: #183047;">
                TripGenius
              </h1>

              <h2>Reset Your Password</h2>

              <p>
                We received a request to reset
                your TripGenius password.
              </p>

              <p>
                Click the button below to create
                a new password.
              </p>

              <a
                href="${resetUrl}"
                style="
                  display: inline-block;
                  padding: 14px 24px;
                  background: #e9ad54;
                  color: #183047;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: bold;
                "
              >
                Reset Password
              </a>

              <p>
                This link will expire in 15 minutes.
              </p>

              <p>
                If you didn't request this,
                you can safely ignore this email.
              </p>
            </div>
          `,
        });
      } catch (mailError) {
        // Մաքրում ենք չուղարկված token-ը։
        await UserModel.updateOne(
          {
            _id: findEmail._id,
            resetPasswordToken: hashedToken,
          },
          {
            $set: {
              resetPasswordToken: null,
              resetPasswordExpires: null,
            },
          }
        );

        throw mailError;
      }
    }

    return res.status(200).json({
      msg: "If this email is registered, reset instructions will be sent.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      msg: "Unable to process password reset request.",
    });
  }
};

export default ForgotPasswordController;
