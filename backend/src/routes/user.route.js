import { Router } from "express";
import {
  getuserbyid,
  register,
  searchBus,
  updateUser,
  createContactUs,
} from "../controllers/user.controller.js";
import { verifyAuth } from "../middlewares/verifyAuth.js";
import { verifyRole } from "../middlewares/verifyRole.js";


const userrouter = Router();

userrouter.route("/register").post(register);
userrouter.route("/:userId").get(verifyAuth, verifyRole(["user"]), getuserbyid);
userrouter.route("/").put(verifyAuth, updateUser);
userrouter.route("/search").post(searchBus);

userrouter.route("/contact-us").post(createContactUs);



export default userrouter;
