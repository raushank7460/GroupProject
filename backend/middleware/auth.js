// const User = require("../models/userModel.js");
// const jwt = require("jsonwebtoken");

// const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

// const authMiddleware = async (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer")) {
//         return res.status(401).json({
//             success: false,
//             message: "Not authorized or token missing",
//         });
//     }

//     const token = authHeader.split(" ")[1];

//     try {
//         const payload = jwt.verify(token, JWT_SECRET);

//         const user = await User.findById(payload.id).select("-password");

//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         req.user = user;
//         next();
//     } catch (err) {
//         console.error("JWT verification failed", err);
//         return res.status(401).json({
//             success: false,
//             message: "Token invalid or expired",
//         });
//     }
// };

// module.exports = authMiddleware;
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized or token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed", err);
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

module.exports = authMiddleware;