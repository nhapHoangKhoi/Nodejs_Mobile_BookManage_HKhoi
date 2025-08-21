import { Request, Response } from "express";
import BookModel from "../../models/book.model";
import { UserRequest } from "../../interfaces/request.interface";
import cloudinary from "../../config/cloudinary";

// lazy loading (infinite loading) when scrolloing using pagination
// idea (sent from frontend): 
// const response = await fetch("http://localhost/api/books?page=1&limit=5");
//
export const getListBooks = async (req: Request, res: Response) => {
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

export const getListOwnerPublishedBooks = async (req: UserRequest, res: Response) => {
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

export const createBook = async (req: UserRequest, res: Response) => {
  try {
    const { title, caption, rating } = req.body;

    if(!title || !caption || !rating) {
      res.status(400).json({ message: "Please provide all fields!" });
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

    res.status(201).json({
      code: "success",
      message: "Create new book successfully!"
    })
  } 
  catch(error: any) {
    console.log("Error creating book!", error);
    res.status(500).json({ message: error.message });
  }
}

export const deleteBookPermanent = async (req: UserRequest, res: Response) => {
  try {
    const book = await BookModel.findById(req.params.id);
    if(!book) {
      res.status(404).json({ 
        message: "Book not found in the system!" 
      });
      return;
    }

    // check if user is the creator of the book
    if(book.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ 
        message: "Unauthorized!" 
      });
      return;
    }

    // https://res.cloudinary.com/de1rm4uto/image/upload/v1741568358/abcdefgh.png
    // delete image from cloduinary as well
    if(book.image && book.image.includes("res.cloudinary.com")) {
      try {
        // pop out the last then split by symbol dot "."
        const publicId = book.image.split("/").pop()?.split(".")[0]; 

        // CDN may still return the cached version until the cache expires (can take hours to days)
        // so we need { invalidate: true }
        await cloudinary.uploader.destroy(`${publicId}`, { invalidate: true });
      } 
      catch (deleteError) {
        console.log("Error deleting image from cloudinary!", deleteError);
      }
    }

    await book.deleteOne();

    res.json({ 
      message: "Book deleted successfully!" 
    });
  } 
  catch(error) {
    console.log("Error deleting book!", error);
    res.status(500).json({ message: "Internal server error!" });
  }
}