import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.middleware.js";
import { sendMessage, recieveMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated,sendMessage);
router.route("/all/:id").get(isAuthenticated,recieveMessage);

export default router;
