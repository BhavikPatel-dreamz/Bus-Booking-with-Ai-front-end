import { Router } from "express";
import {
  adminDashboard,
  createBus,
  createRoute,
  deleteBus,
  deleteRoute,
  getadminbyid,
  getallBus,
  getallRoutes,
  getallStops,
  getBusByid,
  getRouteByid,
  register,
  updateBus,
  updateRoute,
  getAllContactRequests,
  markContactAsRead,
  getReport,
} from "../controllers/admin.controller.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const adminrouter = Router();

adminrouter.route("/register").post(register);
adminrouter
  .route("/:adminId")
  .get(verifyAuth, verifyRole(["admin"]), getadminbyid);

adminrouter
  .route("/dashboard/home")
  .get(verifyAuth, verifyRole(["admin"]), adminDashboard);

adminrouter
  .route("/dashboard/report")
  .post(verifyAuth, verifyRole(["admin"]), getReport);

// route part
adminrouter
  .route("/route/")
  .post(verifyAuth, verifyRole(["admin"]), createRoute);
adminrouter
  .route("/route/get")
  .get(verifyAuth, verifyRole(["admin"]), getallRoutes);
adminrouter.route("/route/stops").get(getallStops);
adminrouter
  .route("/route/:id")
  .get(verifyAuth, verifyRole(["admin"]), getRouteByid);

adminrouter
  .route("/route/update")
  .put(verifyAuth, verifyRole(["admin"]), updateRoute);
// adminrouter
//   .route("/route/reverse")
//   .put(verifyAuth, verifyRole(["admin"]), reverseRoute);
adminrouter
  .route("/route/:id")
  .delete(verifyAuth, verifyRole(["admin"]), deleteRoute);

//bus part
adminrouter.route("/bus/").post(verifyAuth, verifyRole(["admin"]), createBus);
adminrouter.route("/bus/get").get(verifyAuth, verifyRole(["admin"]), getallBus);
adminrouter
  .route("/bus/:id")
  .get(verifyAuth, verifyRole(["admin"]), getBusByid);
adminrouter.route("/bus/").put(verifyAuth, verifyRole(["admin"]), updateBus);
adminrouter
  .route("/bus/:id")
  .delete(verifyAuth, verifyRole(["admin"]), deleteBus);

adminrouter
  .route("/util/contact-us")
  .get(verifyAuth, verifyRole(["admin"]), getAllContactRequests);

adminrouter.patch(
  "/util/contact-us/:id/read",
  verifyAuth,
  verifyRole(["admin"]),
  markContactAsRead,
);

export default adminrouter;
