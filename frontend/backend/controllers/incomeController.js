const XLSX = require("xlsx");
const incomeModel = require("../models/incomeModel.js");
const  getDateRange=require("../utils/dateFilter.js");

//  ADD INCOME 
const addIncome = async (req, res) => {
    const userId=req.user._id;
    const { description, amount, category, date } = req.body;
  try {
   

    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newIncome = new incomeModel({
      description,
      amount,
      category,
      date:new Date(date),
      userId: req.user._id, // auth middleware se
    });
    await newIncome.save();

    res.json({
      success: true,
      message:"Income add Successfully"
    });
  } catch (error) {
    console.log(error);
   return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET ALL INCOME 
const getAllIncome = async (req, res) => {
    const userId=req.user._id;
  try {
    const income = await incomeModel.find({ userId }).sort({date:-1});
    res.json(income);
      

   
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//  update INCOME 
const updateIncome=async (req,res) =>{
    const {id}=req.params;
    const userId=req.user._id;
    const{description,amount}=req.body;
    try{
        const updatedIncome=await incomeModel.findOneAndUpdate(
            {_id:id,userId},
            {description,amount},
            {new:true}
        );
        if(!updatedIncome){
            return res.status(404).json({
                success:false,
                message:"Income not Found",
            })
        }
        res.json({success:true,message:"Income updated successfully.",data:updatedIncome});

    }
    catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
    
    
}
//  DELETE INCOME 
const deleteIncome = async (req, res) => {
  try {
    const income = await incomeModel.findByIdAndDelete({
      _id: req.params.id,
    
    });


    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

   return  res.json({
      success: true,
      message: "Income deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// download Income data 
const downloadIncomeExcel = async (req, res) => {
  const userId = req.user._id;

  try {
    const income = await incomeModel
      .find({ userId })
      .sort({ date: -1 });

    const plainData = income.map((inc) => ({
      Description: inc.description,
      Amount: inc.amount,
      Category: inc.category,
      Date: new Date(inc.date).toLocaleDateString(),
    }));

    // Excel create
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(plainData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "incomeModel");
    XLSX.writeFile(workbook,"income_details.xlsx");

    res.download("income_details.xlsx");


    

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Excel download failed",
    });
  }
};




//  INCOME OVERVIEW 
const getIncomeOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { range ="monthly"} = req.query; // daily / weekly / monthly / yearly

    const { start, end } = getDateRange(range);

    // filter by user + date
    const incomes = await incomeModel.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({date:-1});
    const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
    const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
    const numberOfTransactions = incomes.length;

    const recentTransactions = incomes.slice(0, 9);

    res.json({
      success: true,
      data:{
        totalIncome,
        averageIncome,
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
};


  


module.exports = {
  addIncome,
  getAllIncome,
  updateIncome,
  deleteIncome,
  downloadIncomeExcel,
  getIncomeOverview,

};