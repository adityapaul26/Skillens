const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const cors = require("cors");
const interviewRouter = require("./routes/interview.routes");

const app = express();

// middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/interview", interviewRouter);
app.use("/api/auth", authRouter);

module.exports = app;
