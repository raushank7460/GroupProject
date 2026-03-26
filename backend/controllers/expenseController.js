const expenseModel = require("../models/expenseModel.js");
// const XLSX = require("xlsx");
const getDateRange = require("../utils/dateFilter.js");

// ADD EXPENSE 
const addExpense = async (req, res) => {
   const userId=req.user._id;
  try {
    const { description, amount, category, date } = req.body;

    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newExpense =  new expenseModel({
      description,
      amount,
      category,
      date:new Date(date),
      userId,
    });
    await newExpense.save();

    res.json({ success: true, message:"Expense add successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET ALL EXPENSE 
const getAllExpense = async (req, res) => {
    const userId=req.user._id;
  try {
    const expense = await expenseModel.find({ userId }).sort({date:-1});
    res.json(expense);
      

   
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


//  update Expense
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { description, amount, category, date } = req.body;

  try {
    const updatedExpense = await expenseModel.findOneAndUpdate(
      { _id: id, userId },
      { description, amount, category, date },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully.",
      data: updatedExpense,
    });
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
//delete expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await expenseModel.findByIdAndDelete(
       req.params.id,
    
    );


    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "expense not found",
      });
    }

   return  res.json({
      success: true,
      message: "expense deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// DOWNLOAD EXCEL
// const downloadExpenseExcel = async (req, res) => {
//   try {
//     const expense = await expenseModel
//       .find({ userId: req.user._id })
//       .sort({ date: -1 });

//     const data = expense.map((exp) => ({
//       Description: exp.description,
//       Amount: exp.amount,
//       Category: exp.category,
//       Date: new Date(exp.date).toLocaleDateString(),
//     }));

//     const workbook = XLSX.utils.book_new();
//     const worksheet = XLSX.utils.json_to_sheet(data);

//     XLSX.utils.book_append_sheet(workbook, worksheet, "expenseModel");

//      XLSX.writeFile(workbook,"Expense_details.xlsx");

   

//     res.download("Expense_details.xlsx");
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Excel download failed",
//     });
//   }
// };

//  EXPENSE OVERVIEW 

const getExpenseOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { range ="monthly"} = req.query; // daily / weekly / monthly / yearly

    const { start, end } = getDateRange(range);

    // filter by user + date
      const expense = await expenseModel.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1 });

    const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpense =
      expense.length > 0 ? totalExpense / expense.length : 0;
    const numberOfTransactions = expense.length;
    const recentTransactions=expense.slice(0,5);
    res.json({
      success: true,
      data:{
        totalExpense,
        averageExpense,
        numberOfTransactions,
        recentTransactions,
        range,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch overview",
    });
  }
}
module.exports = {
  addExpense,
  getAllExpense,
  updateExpense,
  deleteExpense,
  // downloadExpenseExcel,
  getExpenseOverview,
};