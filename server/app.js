
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from 'morgan'
import registerRouter from "./routes/registerRoute.js";
import loginRouter from "./routes/loginRoute.js";
import googleRouter from "./routes/googleAuthRoute.js";

const app = express();
dotenv.config();
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



app.get("/", (req, res) => {
    res.send("Hello, World!");
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
})