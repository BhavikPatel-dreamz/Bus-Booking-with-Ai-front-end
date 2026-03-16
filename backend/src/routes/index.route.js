import { Router } from "express";
import userrouter from "./user.route.js";
import adminrouter from "./admin.route.js";
import {
  forgotPassword,
  generateMcpToken,
  login,
  logout,
} from "../controllers/auth.controller.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
import ticketrouter from "./ticket.route.js";
import triprouter from "./trip.route.js";
import aiRouter from "./ai.route.js";
import employeeRouter from "./employee.route.js";
import {authenticateUser} from "../controllers/auth.controller.js"

const indexrouter = Router();

indexrouter.use("/user", userrouter);
indexrouter.use("/admin", adminrouter);
indexrouter.use("/ticket", ticketrouter);
indexrouter.use("/trip", triprouter);
indexrouter.use("/ai", aiRouter);
indexrouter.use("/emp", employeeRouter);
indexrouter.route("/login").post(login);
indexrouter.route("/mcp-token").post(generateMcpToken);
indexrouter.route("/forgetPassword").put(forgotPassword);
indexrouter.route("/logout").post(verifyAuth, logout);
indexrouter.route("/me").get(verifyAuth,authenticateUser)

export default indexrouter;
