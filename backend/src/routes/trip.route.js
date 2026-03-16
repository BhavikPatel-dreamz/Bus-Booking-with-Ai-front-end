import { Router } from "express";
import { verifyAuth } from "../middlewares/verifyAuth.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import {
  createTrip,
  deleteTrip,
  filterBus,
  filterEmployee,
  getAllTrip,
  updateTrip,
} from "../controllers/trip.controller.js";

const triprouter = Router();

// triprouter.route('/filter').post(verifyAuth,verifyRole(['admin']),filterRoutes)
triprouter
  .route("/filterbus")
  .post(verifyAuth, verifyRole(["admin"]), filterBus);
triprouter
  .route("/filteremp")
  .post(verifyAuth, verifyRole(["admin"]), filterEmployee);
triprouter.route("/").post(verifyAuth, verifyRole(["admin"]), createTrip);
triprouter.route("/get").get(verifyAuth, verifyRole(["admin"]), getAllTrip);
triprouter.route("/update").put(verifyAuth, verifyRole(["admin"]), updateTrip);
triprouter
  .route("/delete/:id")
  .delete(verifyAuth, verifyRole(["admin"]), deleteTrip);

export default triprouter;
