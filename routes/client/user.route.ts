import { Router } from "express";
import * as userController from "../../controllers/client/user.controller";

const router = Router();

router.post("/register", userController.registerAccountClient);
router.post("/login", userController.loginAccountClient);

export default router;