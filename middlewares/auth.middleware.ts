import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import AccountAdminModel from "../models/account-admin.model";
import { AccountAdminRequest } from "../interfaces/request.interface";
import AccountClientModel from "../models/account-client.model";

// const response = await fetch(`http://localhost:3000/api/books`, {
//   method: "POST",
//   headers: { Authorization: `Bearer ${token}` },
//   body: JSON.stringify({
//     title,
//     caption
//   }),
// });

export const protectRoute = async (req: AccountAdminRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if(!token) {
      res.status(401).json({ 
        message: "No authentication token, access denied" 
      });
      return;
    } 
    
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;

    const user = await AccountAdminModel
      .findOne({
        _id: id,
        email: email
      })
      .select("-password");

    if(!user) {
      res.status(401).json({ 
        message: "Invalid token!" 
      });
      return;
    }

    req.user = user;
    next();
  } 
  catch(error: any) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ 
      message: "Token is not valid" 
    });
  }
};

export const verifyTokenClient = async (req: AccountAdminRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if(!token) {
      res.status(401).json({ 
        message: "No authentication token, access denied" 
      });
      return;
    } 
    
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;

    const user = await AccountClientModel
      .findOne({
        _id: id,
        email: email
      })
      .select("-password");

    if(!user) {
      res.status(401).json({ 
        message: "Invalid token!" 
      });
      return;
    }

    req.user = user;
    next();
  } 
  catch(error: any) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ 
      message: "Token is not valid" 
    });
  }
};

export const checkIfAnyToken = async (req: AccountAdminRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if(!token) {
      res.status(401).json({ 
        message: "No authentication token, access denied" 
      });
      return;
    } 
    
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;

    const userClient = await AccountClientModel
      .findOne({
        _id: id,
        email: email
      })
      .select("-password");

    const userAdmin = await AccountAdminModel
      .findOne({
        _id: id,
        email: email
      })
      .select("-password");

    if(!userClient && !userAdmin) {
      res.status(401).json({ 
        message: "Invalid token!" 
      });
      return;
    }

    const user = userClient || userAdmin;

    req.user = user;
    next();
  } 
  catch(error: any) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ 
      message: "Token is not valid" 
    });
  }
};