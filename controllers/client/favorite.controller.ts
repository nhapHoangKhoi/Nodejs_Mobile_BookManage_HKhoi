import { Request, Response } from "express";
import FavoriteModel from "../../models/favorite.model";

export const addFavoriteBook = async (req: Request, res: Response) => {
  try {
    const { clientId, bookId } = req.body;

    const isExistedBook = await FavoriteModel.findOne({
      clientId: clientId,
      bookId: bookId
    });

    if(isExistedBook) {
      res.status(400).json({ 
        message: "This book is already in favorites!" 
      });
      return;
    }

    const newFavorite = new FavoriteModel(req.body);
    await newFavorite.save();

    res.status(201).json({
      code: "success",
      message: "Add favorite book successfully!"
    });
  } 
  catch(error: any) {
    if(error.code === 11000) { // because of schema.index unique written in favorite.model.ts
      res.status(400).json({
        code: "error",
        message: "This book is already in your favorites!",
      });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getListFavoriteBooks = async (req: Request, res: Response) => {
  try {
    const { bookId, clientId } = req.params;

    const favoriteBooks = await FavoriteModel.find({
      bookId: bookId,
      clientId: clientId
    });

    res.status(200).json({
      code: "success",
      message: "Add favorite book successfully!",
      favoriteBooks: favoriteBooks
    });
  } 
  catch(error: any) {
    if(error.code === 11000) { // because of schema.index unique written in favorite.model.ts
      res.status(400).json({
        code: "error",
        message: "This book is already in your favorites!",
      });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
}