import { Router } from "express";
import * as favoriteController from "../../controllers/client/favorite.controller";
import * as authMiddleware from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/", 
  authMiddleware.verifyTokenClient,
  favoriteController.addFavoriteBook
);

export default router;