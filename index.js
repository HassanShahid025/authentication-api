import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/connect.js";
import authRouter from "./routes/auth-route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the Auth API");
})
app.use("/api/auth", authRouter);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.CONNECTION_URI);
    app.listen(PORT, console.log(`Server listening at port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
