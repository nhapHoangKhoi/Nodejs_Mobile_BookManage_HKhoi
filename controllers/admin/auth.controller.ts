import { Request, Response } from "express";
import UserModel from "../../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerAccountAdmin = async (request: Request, response: Response) => {
  try {
    const { email, username, password } = request.body;

    if(!username || !email || !password) {
      response.status(400).json({ message: "All fields are required" });
      return;
    }

    if(password.length < 6) {
      response.status(400).json({ message: "Password should be at least 6 characters long" });
      return;
    }

    if(username.length < 3) {
      response.status(400).json({ message: "Username should be at least 3 characters long" });
      return;
    }

    // check if user already exists
    const existingEmail = await UserModel.findOne({ email });
    if(existingEmail) {
      response.status(400).json({ message: "Email already exists" });
      return;
    }

    const existingUsername = await UserModel.findOne({ username });
    if(existingUsername) {
      response.status(400).json({ message: "Username already exists" });
      return;
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // get random avatar
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const user = new UserModel({
      email: email,
      username: username,
      password: hashedPassword,
      profileImage: profileImage
    });

    await user.save();

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      `${process.env.JWT_SECRET}`,
      { 
        expiresIn: '1d' // token is valid for 1 day
      }
    );

    response.status(201).json({
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
    response.status(500).json({ message: "Internal server error" });
  }
}

export const loginAccountAdmin = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;

    if(!email || !password) {
      response.status(400).json({ message: "All fields are required" });
      return;
    }

    // check if user exists
    const user = await UserModel.findOne({ email: email });
    if(!user) {
      response.status(400).json({ message: "Invalid credentials" });
      return;
    }
    
    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, `${user.password}`);
    if(!isPasswordCorrect) {
      response.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      `${process.env.JWT_SECRET}`,
      { 
        expiresIn: '1d' // token is valid for 1 day
      }
    );

    response.status(200).json({
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
    response.status(500).json({ message: "Internal server error" });
  }
}