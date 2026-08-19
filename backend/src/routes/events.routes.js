import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { listEvents, createEvent, updateEvent } from "../controllers/events.controller.js";

const router = Router();

router.get("/", auth, listEvents);
router.post("/", auth, adminOnly, createEvent);
router.put("/:id", auth, adminOnly, updateEvent);

export default router;
