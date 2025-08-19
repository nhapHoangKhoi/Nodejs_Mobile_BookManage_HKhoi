import { Router, Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = Router();

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, `${process.env.JWT_SECRET}`, { expiresIn: "1d" });
};

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    if(!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if(password.length < 6) {
      res.status(400).json({ message: "Password should be at least 6 characters long" });
      return;
    }

    if(username.length < 3) {
      res.status(400).json({ message: "Username should be at least 3 characters long" });
      return;
    }

    // check if user already exists
    const existingEmail = await User.findOne({ email });
    if(existingEmail) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const existingUsername = await User.findOne({ username });
    if(existingUsername) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    // get random avatar
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const user = new User({
      email,
      username,
      password,
      profileImage,
    });

    await user.save();

    const token = generateToken(`${user._id}`);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } 
  catch(error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // check if user exists
    const user = await User.findOne({ email: email });
    if(!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    
    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, `${user.password}`);
    if(!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(`${user._id}`);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } 
  catch (error) {
    console.log("Error in login route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;