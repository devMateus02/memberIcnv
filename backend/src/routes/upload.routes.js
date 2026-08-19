import { Router } from "express";
import { uploadSelfie, uploadEventImage } from "../controllers/upload.controller.js";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = Router();
router.post("/selfie", uploadSelfie);
router.post("/event-image", auth, adminOnly, uploadEventImage);
export default router;
