const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const { getDashboardOverview } = require("../controllers/dashboardController.js");

const dashboardRouter = express.Router();

//  ROUTES 

// Dashboard Overview
dashboardRouter.get("/", authMiddleware, getDashboardOverview);

module.exports = dashboardRouter;