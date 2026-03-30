require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const userRouter = require("./routes/userRoute.js"); 
const incomeRouter = require("./routes/incomeRoute.js");
const expenseRouter = require("./routes/expenseRoute.js");
const dashboardRouter = require("./routes/dashboardRoute.js");
const path = require("path");




const app = express();
const port = process.env.PORT || 7001; // changed from 7000 to 7001

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// DB
connectDB();

// Routes
app.use("/api/user", userRouter);
app.use("/api/income", incomeRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/dashboard", dashboardRouter);


// Test route
app.get("/", (req, res) => {
  res.send("API Working");
});


app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});



// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});