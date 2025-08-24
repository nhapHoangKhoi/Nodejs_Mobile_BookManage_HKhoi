import { Router } from "express";
import * as favoriteController from "../../controllers/client/favorite.controller";
import * as authMiddleware from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/", 
  authMiddleware.verifyTokenClient,
  favoriteController.addFavoriteBook
);

router.get(
  "/:bookId/:clientId", 
  authMiddleware.verifyTokenClient,
  favoriteController.getBookFromFavorite
);

router.get(
  "/:clientId", 
  authMiddleware.verifyTokenClient,
  favoriteController.getListFavoriteBooks
);

router.delete(
  "/:bookId/:clientId", 
  authMiddleware.verifyTokenClient,
  favoriteController.removeBookFromFavorites
);

export default router;