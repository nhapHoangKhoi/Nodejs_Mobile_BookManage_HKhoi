import { Router, Request, Response } from "express";
import * as accountController from "../../controllers/admin/account.controller";
import * as authMiddleware from "../../middlewares/auth.middleware";

const router = Router();

router.put(
  "/:id", 
  authMiddleware.protectRoute,
  accountController.editProfile
);

export default router;