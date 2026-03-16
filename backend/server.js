

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
//const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const validator = require("validator");
// const XLSX = require("xlsx");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 7000;

// MiddleWare

app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// DB

connectDB();
// Routes

app.get("/",(req,res)=>{
    res.send("API Working");
})

app.listen(port,()=>{
    console.log("Server is runnig ");
})
