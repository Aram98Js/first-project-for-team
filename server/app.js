import  { createTripRouter, getMyTripsRouter, getTripRouter } from "./routes/tripRoute.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from 'morgan'
import registerRouter from "./routes/registerRoute.js";
import loginRouter from "./routes/loginRoute.js";
import googleRouter from "./routes/googleAuthRoute.js";
import getUserProfileRouter from "./routes/getProfileRoute.js";
import forgotPasswordRouter from "./routes/forgotPasswordRoute.js";
import verifyRouter from "./routes/verificationRoute.js";
import resendOtpRouter from "./routes/resendOtpRoute.js";
import destinationRouter from "./routes/destinationsRoute.js";
import editUpdateRouter from "./routes/editProfileRoute.js";

const app = express();


dotenv.config({
  path: "./.env",
  override: true,
});

console.log("SERVER EMAIL:", process.env.EMAIL_USER);
console.log(
  "PASSWORD LENGTH:",
  process.env.EMAIL_PASSWORD?.replace(/\s/g, "").length
);
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("dev"))
app.use(bodyParser.urlencoded({extended: true}))



//api routes for pages

app.use(registerRouter)
app.use(loginRouter);
app.use(googleRouter);
app.use(getUserProfileRouter)
app.use(forgotPasswordRouter)
app.use(createTripRouter);
app.use(getTripRouter);
app.use(getMyTripsRouter);
app.use(verifyRouter)
app.use(resendOtpRouter)
app.use(destinationRouter)
app.use(editUpdateRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
})