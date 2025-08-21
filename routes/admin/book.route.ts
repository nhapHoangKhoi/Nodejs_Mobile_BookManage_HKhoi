import { Router } from "express";
import * as bookController from "../../controllers/admin/book.controller";
import * as authMiddleware from "../../middlewares/auth.middleware";
// --- Libray for uploading file, and upload to cloudinary
import multer from "multer";
import { storage } from "../../config/cloudinary";
const upload = multer({ 
  storage: storage 
});
// --- End libray for uploading file, and upload to cloudinary

const router = Router();

// lazy loading (infinite loading) when scrolloing using pagination
// idea (sent from frontend): 
// const response = await fetch("http://localhost/api/books?page=1&limit=5");
//
router.get(
  "/", 
  authMiddleware.protectRoute, 
  bookController.getListBooks
);

router.get(
  "/user", 
  authMiddleware.protectRoute, 
  bookController.getListOwnerPublishedBooks
);

router.post(
  "/", 
  authMiddleware.protectRoute,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'fileBook', maxCount: 1 }
  ]), 
  bookController.createBook
);

router.delete(
  "/:id", 
  authMiddleware.protectRoute, 
  bookController.deleteBookPermanent
);

export default router;