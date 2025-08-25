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
    "expireAt": { 
      type: Date,  
      expires: 0 // automatically delete the document after 0 seconds
    }
  },
  { 
    timestamps: true 
  }
);

const RatingLimitModel = mongoose.model("RatingLimit", schema, "ratingLimits");

export default RatingLimitModel;