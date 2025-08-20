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

// lazy loading when scrolloing using pagination
// idea (sent from frontend): 
// const response = await fetch("http://localhost/api/books?page=1&limit=5");
//
router.get("/", 
  protectRoute, 
  async (req: Request, res: Response) => {
    try {
      const page: number = parseInt(`${req.query.page}`) || 1;
      const limit: number = parseInt(`${req.query.limit}`) || 2;
      const skip = (page - 1) * limit;

      const totalRecords = await BookModel.countDocuments();
      const totalPages = Math.ceil(totalRecords/limit);

      const books = await BookModel.find()
        .sort({
          createdAt: "desc"
        })
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage"); // from field "user" in each book record,
                                                    // next get the correspond username, image
      res.json({
        books: books,
        currentPage: page,
        totalRecords: totalRecords,
        totalPages: totalPages,
      });
    } 
    catch (error) {
      console.log("Error in get all books route", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/user", 
  protectRoute, 
  async (req: UserRequest, res: Response) => {
    try {
      const books = await BookModel
        .find({ 
          user: req.user._id 
        })
        .sort({
          createdAt: "desc"
        });
      
      res.json({
        books: books
      });
    } 
    catch (error: any) {
      console.error("Get user books error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;