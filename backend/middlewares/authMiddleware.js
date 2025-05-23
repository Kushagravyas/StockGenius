import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 3. Protect routes - check if user is logged in
export const protect = async (req, res, next) => {
  try {
    // Get token from header
    // headers.authorization: Bearer ${token} so split(" ") then it returns array of
    // ['Bearer','${token}']
    // hence, [1] returns ${token}
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    // decoded.userId because in createToken(user) we have userId as argument and jwt.sign({ id:user._id, role:user.role }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

// Admin role middleware
export const isAdmin = (req, res, next) => {
  if (req.user.role != "admin") {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Admin access required!",
    });
  }
  next();
};
