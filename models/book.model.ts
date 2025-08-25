import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    fileBook: {
      type: String,
      required: true
    },
    rating: { // used only for once as initialRating
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountAdmin",
      required: true,
    },
  },
  { 
    timestamps: true 
  }
);

const BookModel = mongoose.model("Book", schema, "books");

export default BookModel;