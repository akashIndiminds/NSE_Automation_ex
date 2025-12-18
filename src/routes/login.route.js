import express from "express";
import { loginController } from "../controllers/login.controller.js";

const loginRoutes = express.Router();

loginRoutes.post('/auth', loginController);

export default loginRoutes;