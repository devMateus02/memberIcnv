import { Router } from "express";
import { getLoggedUser } from "../controllers/user.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/me", auth, getLoggedUser);

export default router;
