import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    ratingValue: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountClient",
      required: true,
    },
  },
  { 
    timestamps: true 
  }
);

const RatingModel = mongoose.model("Rating", schema, "ratings");

export default RatingModel;