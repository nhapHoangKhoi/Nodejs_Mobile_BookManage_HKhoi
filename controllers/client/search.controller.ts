import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import BookModel from "../../models/book.model";
import unidecode from "unidecode";
import { BookInterface } from "../../interfaces/book.interface";

// fetch("http://localhost/api/books?keyword=abcd&page=1&limit=5");
export const searchItems = async (req: Request, res: Response) => {
  try {
    const objectFind: FilterQuery<BookInterface> = {};

    // ----- Search ----- //
    let keyword = req.query.inputKeyword as string || "";
    if(keyword) {
      let keywordSlug = keyword.trim(); // remvove white-spaces at 2 ends
      keywordSlug = keywordSlug.replace(/\s/g, "-");
      keywordSlug = keywordSlug.replace(/-+/g, "-");
      
      keywordSlug = unidecode(keywordSlug);
      // console.log(keyword); // cắt doi
      // console.log(keywordSlug); // cat-doi

      const listKeywords = keyword.split(/\s+/).map(word => {
        return word.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&'); // escape special characters
      });

      const regexKeyword = new RegExp(listKeywords.join(".*"), "i"); // ".*" allows for any characters in between
      const regexKeywordSlug = new RegExp(keywordSlug, "i");

      objectFind.$or = [
        { title: regexKeyword },
        { slug: regexKeywordSlug }
      ];
    }
    // ----- End search ----- //

    const page: number = parseInt(`${req.query.page}`) || 1;
    const limit: number = parseInt(`${req.query.limit}`) || 2;
    const skip = (page - 1) * limit;

    const totalRecords = await BookModel.countDocuments(objectFind); // this line is important
    const totalPages = Math.ceil(totalRecords/limit);

    const books = await BookModel
      .find(objectFind)
      .sort({
        avgRating: "desc",
        createdAt: "desc"
      })
      .skip(skip)
      .limit(limit)
      .select("-user");

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