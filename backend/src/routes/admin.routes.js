import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";
import {
  listPending,
  approveUser,
  rejectUser, getUsersStats,
  deactivateUser,
  activateUser
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/pending", auth, adminOnly, listPending);

router.put(
  "/users/:id/approve",
  auth,
  adminOnly,
  approveUser
);

router.put(
  "/users/:id/reject",
  auth,
  adminOnly,
  rejectUser
);

router.put(
  "/users/:id/deactivate",
  auth,
  adminOnly,
  deactivateUser
);

router.put(
  "/users/:id/activate",
  auth,
  adminOnly,
  activateUser
);

router.post("/logout", auth, (req, res) => {
  return res.json({ message: "Logout realizado com sucesso" });
});

router.get(
  "/stats",
  auth,
  getUsersStats
);

export default router;

