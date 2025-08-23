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

// prevent duplicate favorite per (client, book)
schema.index({ client: 1, book: 1 }, { unique: true });

const FavoriteModel = mongoose.model("Favorite", schema, "favorites");

export default FavoriteModel;