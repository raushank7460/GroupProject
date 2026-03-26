const express = require("express");

const {
  getCurrentUser,
  loginUser,
  registerUser,
  updatePassword,
  updateProfile
} = require("../controllers/userController.js"); 

const authMiddleware = require("../middleware/auth.js");

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Protected routes
userRouter.get("/me", authMiddleware, getCurrentUser);
userRouter.put("/profile", authMiddleware, updateProfile);
userRouter.put("/password", authMiddleware, updatePassword);

module.exports = userRouter;