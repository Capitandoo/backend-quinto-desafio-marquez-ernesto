import { Router } from "express";
import { registroController, loginController, logoutController } from "../controllers/UserController.js";

const router = Router();

router.post("/registro", registroController);
router.post("/login", loginController);
router.post("/logout", logoutController);

export default router;
