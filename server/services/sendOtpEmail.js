import transporter from "../config/mailTransporter.js";

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"TripGenius" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your TripGenius account",
    text: `Your TripGenius verification code is ${otp}. It expires in 5 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:30px">
        <h1 style="color:#19344d">TripGenius ✦</h1>

        <h2>Verify your email address</h2>

        <p>
          Thank you for registering with TripGenius.
          Enter the following code to verify your email.
        </p>

        <div style="
          padding:20px;
          background:#fff3df;
          border-radius:12px;
          text-align:center;
          font-size:32px;
          font-weight:bold;
          letter-spacing:8px;
          color:#19344d;
        ">
          ${otp}
        </div>

        <p>This code expires in 5 minutes.</p>

        <p style="color:#888;font-size:13px">
          If you did not create this account, you can ignore this email.
        </p>
      </div>
    `,
  });
};