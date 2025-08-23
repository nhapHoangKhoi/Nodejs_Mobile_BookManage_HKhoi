import { Request, Response } from "express";
import BookModel from "../../models/book.model";
import { BookRequest } from "../../interfaces/request.interface";
import { deleteAssetOutOfCloudinary } from "../../utils/cloudinary.utils";

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

export const getListOwnerPublishedBooks = async (req: BookRequest, res: Response) => {
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

export const createBook = async (req: BookRequest, res: Response) => {
  try {
    const { title, caption, rating } = req.body;

    if(!title || !caption || !rating) {
      res.status(400).json({ message: "Please provide all fields!" });
      return;
    }

    // Object.keys()  => convert object to array of keys
    // request.files  =>  { logo: 5, favicon: 10 }  =>  Objet.keys()  =>  [ "logo", "favion" ]
    //
    // typscript => ?? {} means if req.files is undefined, replace with an empty object
    //
    const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if(Object.keys(uploadedFiles).length > 0) {
      if(uploadedFiles.image) {
        req.body.image = uploadedFiles.image[0].path;
      } 
      else {
        delete req.body.image;
      }

      if(uploadedFiles.fileBook) {
        req.body.fileBook = uploadedFiles.fileBook[0].path;
      } 
      else {
        delete req.body.fileBook;
      }
    } 
    else {
      delete req.body.image;    // warning: request.body.avatar = "" is incorrect
      delete req.body.fileBook; // it will override the data in database as "" => losing image
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

export const getEditDetailedBook = async (req: BookRequest, res: Response) => {
  try {
    const id = req.params.id;

    const bookDetail = await BookModel.findOne({
      _id: id,
      user: req.user.id
    })

    if(!bookDetail) {
      res.json({
        code: "error",
        message: "ID invalid!"
      })
      return;
    }

    res.json({
      code: "success",
      message: "Get detailed book successfully!",
      bookDetail: bookDetail
    })
  } 
  catch(error) {
    console.log(error);
    res.json({
      code: "error",
      message: "ID invalid!"
    })
  }
}

export const editBook = async (req: BookRequest, res: Response) => {
  try {
    const id = req.params.id;
    const { title, caption, rating } = req.body;

    if(!title || !caption || !rating) {
      res.status(400).json({ message: "Please provide all fields!" });
      return;
    }

    const oldBook = await BookModel.findOne({
      _id: id,
      user: req.user.id
    }).select("image fileBook");

    if(!oldBook) {
      res.status(404).json({
        code: "error",
        message: "ID invalid!"
      })
      return;
    }

    // Object.keys()  => convert object to array of keys
    // request.files  =>  { logo: 5, favicon: 10 }  =>  Objet.keys()  =>  [ "logo", "favion" ]
    //
    // typscript => ?? {} means if req.files is undefined, replace with an empty object
    //
    const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if(Object.keys(uploadedFiles).length > 0) {
      if(uploadedFiles.image) {
        req.body.image = uploadedFiles.image[0].path;

        // delete image, file from cloudinary as well
        await deleteAssetOutOfCloudinary(oldBook.image);
      } 
      else {
        delete req.body.image;
      }

      if(uploadedFiles.fileBook) {
        req.body.fileBook = uploadedFiles.fileBook[0].path;

        // delete image, file from cloudinary as well
        await deleteAssetOutOfCloudinary(oldBook.fileBook);
      } 
      else {
        delete req.body.fileBook;
      }
    } 
    else {
      delete req.body.image;    // warning: request.body.avatar = "" is incorrect
      delete req.body.fileBook; // it will override the data in database as "" => losing image
    }

    req.body.user = req.user._id;

    await BookModel.updateOne({
      _id: id,
      user: req.user.id
    }, req.body)

    res.status(200).json({
      code: "success",
      message: "Update book successfully!"
    })
  } 
  catch(error: any) {
    console.log("Error creating book!", error);
    res.status(500).json({ message: error.message });
  }
}

export const deleteBookPermanent = async (req: BookRequest, res: Response) => {
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
    // delete image, file from cloudinary as well
    await deleteAssetOutOfCloudinary(book.image);
    await deleteAssetOutOfCloudinary(book.fileBook);

    await book.deleteOne();

    res.json({ 
      message: "Delete book successfully!" 
    });
  } 
  catch(error) {
    console.log("Error deleting book!", error);
    res.status(500).json({ message: "Internal server error!" });
  }
}