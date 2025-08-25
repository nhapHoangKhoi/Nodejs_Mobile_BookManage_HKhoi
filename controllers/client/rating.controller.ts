import { Response, Request } from "express";
import BookModel from "../../models/book.model";
import RatingModel from "../../models/rating.model";
import { AccountClientRequest } from "../../interfaces/request.interface";

export const createRating = async (req: AccountClientRequest, res: Response) => {
  try {
    const { ratingValue, bookId } = req.body;

    if(!ratingValue || !bookId) {
      res.status(400).json({ message: "Please provide ratingValue and bookId!" });
      return;
    }

    const book = await BookModel.findById(bookId);
    if(!book) {
      res.status(404).json({ message: "Book not found!" });
      return
    }

    const userId = req.user._id;

    // check if user is admin (assuming req.user has a role field)
    // if(req.user.role === "admin") {
    //   res.status(403).json({ message: "Admins can only set initial rating during book creation" });
    //   return;
    // }

    // check if user already rated
    const existingRating = await RatingModel.findOne({ bookId, userId });
    if(existingRating) {
      res.status(400).json({ message: "You have already rated this book!" });
      return;
    }

    const newRating = new RatingModel({ ratingValue, bookId, userId });
    await newRating.save();

    // update book's average rating
    await updateBookRating(bookId);

    res.status(201).json({
      success: true,
      message: "Rating created successfully",
      data: newRating,
    });
  }
   catch (error: any) {
    console.log("Error creating rating", error);
    res.status(500).json({ message: error.message });
  }
};

// this function is used to retrieve more information of who rates, how much he/she rates
// export const getRatingsByBookId = async (req: Request, res: Response) => {
//   try {
//     const { bookId } = req.params;
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const skip = (page - 1) * limit;

//     const book = await BookModel.findById(bookId);
//     if (!book) {
//       return res.status(404).json({ message: "Book not found" });
//     }

//     const ratings = await RatingModel.find({ bookId })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate("userId", "username"); // Adjust fields as needed

//     const total = await RatingModel.countDocuments({ bookId });

//     res.status(200).json({
//       success: true,
//       message: "Ratings fetched successfully",
//       data: ratings,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error: any) {
//     console.log("Error fetching ratings", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// helper function to update book's avgRating and ratingCount
const updateBookRating = async (bookId: string) => {
  const book = await BookModel.findById(bookId);
  if (!book) return;

  // get all ratings for the book
  const ratings = await RatingModel.find({ bookId });
  const ratingValues = ratings.map((r) => r.ratingValue);

  // calculate average
  const totalRatings = ratingValues.length;
  const avgRating = totalRatings > 0 
    ? ratingValues.reduce((sum, val) => sum + val, 0) / totalRatings 
    : 0;

  book.avgRating = avgRating;
  book.ratingCount = totalRatings;

  await book.save();
};