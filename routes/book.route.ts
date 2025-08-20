import { Router, Request, Response } from "express";
import BookModel from "../models/book.model";
import protectRoute from "../middlewares/auth.middleware";
import { UserRequest } from "../interfaces/request.interface";
// --- Libray for uploading file, and upload to cloudinary
import multer from "multer";
import { storage } from "../config/cloudinary";
const upload = multer({ 
  storage: storage 
});
// --- End libray for uploading file, and upload to cloudinary

const router = Router();

router.post("/", 
  protectRoute,
  upload.single("image"),
  async (req: UserRequest, res: Response) => {
    try {
      const { title, caption, rating } = req.body;

      if(!title || !caption || !rating) {
        res.status(400).json({ message: "Please provide all fields" });
        return;
      }

      if(req.file) {
        req.body.image = req.file.path;
      } 
      else {
        delete req.body.image;
      }

      req.body.user = req.user._id;

      const newBook = new BookModel(req.body);
      await newBook.save();

      res.status(201).json(newBook);
    } 
    catch(error: any) {
      console.log("Error creating book", error);
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;