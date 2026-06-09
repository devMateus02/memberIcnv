import { Router } from "express";
import { register, login, checkEmail } from "../controllers/auth.controller.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/checkEmail",checkEmail)

export default router;


