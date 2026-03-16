import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accesstoken || req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized request",
      });
    }

    
    const decoded = jwt.decode(token, process.env.ACCESS_TOKEN);
    const user = await User.findById(decoded.id).select("-password");
    req.user = { ...user.toObject(), token };
    next();
  } catch (error) { 
    next(error);
  }
};
