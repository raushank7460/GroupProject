const express = require("express");
const authMiddleware = require("../middleware/auth.js");

const {
  addIncome,
  getAllIncome,
  updateIncome,
  deleteIncome,
  // downloadIncomeExcel,
  getIncomeOverview,
} = require("../controllers/incomeController.js");

const incomeRouter = express.Router();

//  ROUTES 

//  Add Income
incomeRouter.post("/add", authMiddleware, addIncome);

//  Get All Income
incomeRouter.get("/get", authMiddleware, getAllIncome);

//  Update Income
incomeRouter.put("/update/:id", authMiddleware, updateIncome);

//  Delete Income
incomeRouter.delete("/delete/:id", authMiddleware, deleteIncome);

//  Download Excel
// incomeRouter.get("/download", authMiddleware, downloadIncomeExcel);

//  Income Overview (filter: daily/weekly/monthly/yearly)
incomeRouter.get("/overview", authMiddleware, getIncomeOverview);

module.exports = incomeRouter;