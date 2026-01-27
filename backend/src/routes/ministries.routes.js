import { Router } from "express";
import { listMinistries } from "../controllers/ministries.controller.js";

const router = Router();
router.get("/", listMinistries);
export default router;
