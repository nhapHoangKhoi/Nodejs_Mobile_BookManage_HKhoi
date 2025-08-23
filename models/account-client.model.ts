import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  { 
    timestamps: true // automatically insert field createdAt, updatedAt
  }
);

const AccountClientModel = mongoose.model("AccountClient", schema, "accounts-client");

export default AccountClientModel;