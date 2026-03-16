import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDb } from "./src/db/db.js";
import indexrouter from "./src/routes/index.route.js";

dotenv.config();

await connectDb();

const app = express();
const port = process.env.PORT;

app.use((req, res,next)=>{
    console.log((new Date().toTimeString().slice(0, 8)), req.method, req.url)
    next();
})
 
app.use(cors({ origin: [process.env.FRONTEND_URL, (process.env.CHATBOT_URL || ""), (process.env.AGENT_URL || "")], credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(cookieParser());

app.use("/api", indexrouter);

app.listen(port, () => console.log(`App listen on ${port}`));
