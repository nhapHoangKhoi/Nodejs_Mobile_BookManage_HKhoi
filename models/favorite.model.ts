import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountClient",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
  },
  { 
    timestamps: true // automatically insert field createdAt, updatedAt
  }
);

const FavoriteModel = mongoose.model("Favorite", schema, "favorites");

export default FavoriteModel;