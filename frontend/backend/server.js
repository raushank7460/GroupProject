const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const userRouter = require("./routes/userRoute.js"); 
const incomeRouter = require("./routes/incomeRoute.js");
const expenseRouter = require("./routes/expenseRoute.js");
const dashboardRouter = require("./routes/dashboardRoute.js");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
connectDB();

// Routes
app.use("/api/user", userRouter);
app.use("/api/income", incomeRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/dashboard",dashboardRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});