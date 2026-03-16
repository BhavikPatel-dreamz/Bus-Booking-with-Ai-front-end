import { User } from "../models/user.model.js";
import { asynchandller } from "../util/asynchandller.js";

export const verifyRole = (roles = []) =>
  asynchandller(async (req, res, next) => {
    try {
      if (!req.user._id) {
        return res.status(400).json({
          success: false,
          message: "Unauthorized request",
        });
      }

      
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found",
        });
      }

      if (roles.includes(user.role)) next();
      else
        return res
          .status(400)
          .json({
            success: false,
            message: "you are not allowed to perform this action",
          });
    } catch (error) {
      console.error(error);
    }
  });
