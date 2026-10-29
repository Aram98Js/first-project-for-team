import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER?.trim(),
    pass: process.env.EMAIL_PASSWORD?.replace(/\s/g, ""),
  },
});

console.log("TRANSPORTER EMAIL:", transporter.options.auth.user);
console.log(
  "TRANSPORTER PASSWORD LENGTH:",
  transporter.options.auth.pass?.length
);

export default transporter;