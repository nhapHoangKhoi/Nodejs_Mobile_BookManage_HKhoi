import { Request, Response } from "express";
import BookModel from "../../models/book.model";

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
      .limit(limit);

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

export const getDetailedBook = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const record = await BookModel.findOne({
      _id: id
    })

    if(!record) {
      res.json({
        code: "error",
        message: "ID invalid!"
      })
      return;
    }

    const dataFinal = {
      id: record.id,
      title: record.title,
      caption: record.caption,
      image: record.image,
      fileBook: record.fileBook,
      rating: record.rating,
      updatedAt: record.updatedAt
    };

    res.json({
      code: "success",
      message: "Get detailed book successfully!",
      bookDetail: dataFinal
    })
  } 
  catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "ID invalid!"
    })
  }
}