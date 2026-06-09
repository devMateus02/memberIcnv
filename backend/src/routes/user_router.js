import { Router } from "express";
import { getLoggedUser, getAllUsers, updateUser} from "../controllers/user.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/me", auth, getLoggedUser);
router.get("/allUser", auth, getAllUsers )
router.put("/users/:id",auth, updateUser)

export default router;
