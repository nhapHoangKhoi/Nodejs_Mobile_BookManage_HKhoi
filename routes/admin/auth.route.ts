import { Router, Request, Response } from "express";
import * as authController from "../../controllers/admin/auth.controller";

const router = Router();

router.post("/register", authController.registerAccountAdmin);
router.post("/login", authController.loginAccountAdmin);

export default router;