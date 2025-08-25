import mongoose, { Document } from "mongoose";

export interface BookInterface extends Document {
  title: string;
  caption: string;
  image: string;
  fileBook: string;
  rating: number;
  avgRating: number;
  ratingCount: number;
  user: mongoose.Types.ObjectId;
  slug?: string;
  createdAt: Date;
  updatedAt: Date;
}