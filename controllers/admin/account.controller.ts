import { Request, Response } from "express";
import AccountAdminModel from "../../models/account-admin.model";

export const editProfile = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { username } = req.body;

    if(!username) {
      res.status(400).json({ message: "Please provide all fields!" });
      return;
    }

    if(username.length < 3) {
      res.status(400).json({ message: "Username should be at least 3 characters long" });
      return;
    }

    const existingUsername = await AccountAdminModel.findOne({ username });
    if(existingUsername) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    const oldAccount = await AccountAdminModel.findOne({
      _id: id,
    }).select("username");

    if(!oldAccount) {
      res.status(404).json({
        code: "error",
        message: "ID invalid!"
      })
      return;
    }

    // Object.keys()  => convert object to array of keys
    // request.files  =>  { logo: 5, favicon: 10 }  =>  Objet.keys()  =>  [ "logo", "favion" ]
    //
    // typscript => ?? {} means if req.files is undefined, replace with an empty object
    //
    // const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // if(Object.keys(uploadedFiles).length > 0) {
    //   if(uploadedFiles.image) {
    //     req.body.image = uploadedFiles.image[0].path;

    //     // delete image, file from cloudinary as well
    //     await deleteAssetOutOfCloudinary(oldBook.image);
    //   } 
    //   else {
    //     delete req.body.image;
    //   }
    // } 
    // else {
    //   delete req.body.image;    // warning: request.body.avatar = "" is incorrect
    //                             // it will override the data in database as "" => losing image
    // }

    await AccountAdminModel.updateOne({
      _id: id,
    }, req.body)

    res.status(200).json({
      code: "success",
      message: "Update profile successfully!"
    })
  } 
  catch(error: any) {
    console.log("Error update profile!", error);
    res.status(500).json({ message: error.message });
  }
}