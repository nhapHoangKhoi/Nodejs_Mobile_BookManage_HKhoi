import { Router } from "express";
import * as ratingController from "../../controllers/client/rating.controller";
import * as authMiddleware from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/", 
  authMiddleware.checkIfAnyToken,
  ratingController.createRating
);

export default router;