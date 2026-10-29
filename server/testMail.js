import "dotenv/config";
import transporter from "./config/mailTransporter.js";

try {
  await transporter.verify();

  console.log("SMTP authentication successful");
} catch (error) {
  console.error("SMTP verification failed:", {
    code: error.code,
    responseCode: error.responseCode,
    message: error.message,
  });
}