import { Router } from "express";
import {
  createEmp,
  deleteEmpById,
  getAllEmp,
  getEmpByRole,
  updateEmpById,
} from "../controllers/employee.controller.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const employeeRouter = Router();

employeeRouter
  .route("/create")
  .post(verifyAuth, verifyRole(["admin"]), createEmp);
employeeRouter
  .route("/get")
  .post(verifyAuth, verifyRole(["admin"]), getEmpByRole);
employeeRouter
  .route("/getemps")
  .get(verifyAuth, verifyRole(["admin"]), getAllEmp);

employeeRouter
  .route("/update")
  .put(verifyAuth, verifyRole(["admin"]), updateEmpById);
employeeRouter
  .route("/delete/:id")
  .delete(verifyAuth, verifyRole(["admin"]), deleteEmpById);

export default employeeRouter;
