const express = require("express");
const authMiddleware = require("../middleware/auth.js");
const  getDateRange=require("../utils/dateFilter.js");

const {
  addExpense,
  getAllExpense,
  updateExpense,
  deleteExpense,
  // downloadExpenseExcel,
  getExpenseOverview,
} = require("../controllers/expenseController.js");

const expressRouter = express.Router();

//  ROUTES 

//  Add Expense
expressRouter.post("/add", authMiddleware, addExpense);

//  Get All Expense
expressRouter.get("/get", authMiddleware, getAllExpense);

//  Update Expense
expressRouter.put("/update/:id", authMiddleware, updateExpense);

//  Delete Expense
expressRouter.delete("/delete/:id", authMiddleware, deleteExpense);

//  Download Excel
// expressRouter.get("/download", authMiddleware, downloadExpenseExcel);

//  Overview
expressRouter.get("/overview", authMiddleware, getExpenseOverview);

module.exports = expressRouter;