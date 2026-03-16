import { Router } from "express";
import { verifyAuth } from "../middlewares/verifyAuth.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import {
  createTicket,
  getallSeat,
  getallticket,
  getTickets,
  ticketCancel,
  ticketDelete,
  ticketgetByid,
  ticketUpdate,
} from "../controllers/ticket.controller.js";

const ticketrouter = Router();

// ticketrouter
//   .route("/:busid/:seatid")
//   .put(verifyAuth, verifyRole(["user"]), seatUpdate);
ticketrouter.route("/seat/get").post(verifyAuth, verifyRole(["user"]), getallSeat);
ticketrouter.route("/").post(verifyAuth, verifyRole(["user"]), createTicket);
ticketrouter
  .route("/admin/get")
  .get(verifyAuth, verifyRole(["admin"]), getallticket);
ticketrouter
  .route("/user/get")
  .get(verifyAuth, verifyRole(["user"]), getTickets);
ticketrouter
  .route("/user/:id")
  .get(verifyAuth, verifyRole(["user"]), ticketgetByid);
ticketrouter.route("/:id").put(verifyAuth, verifyRole(["user"]), ticketCancel);
ticketrouter
  .route("/update/payment/:id")
  .put(verifyAuth, verifyRole(["user"]), ticketUpdate);
ticketrouter.route("/delete/:id").delete(ticketDelete);

export default ticketrouter;
