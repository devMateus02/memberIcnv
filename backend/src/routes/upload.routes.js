import { Router } from "express";
import { uploadSelfie } from "../controllers/upload.controller.js";

const router = Router();
router.post("/selfie", uploadSelfie);
export default router;
