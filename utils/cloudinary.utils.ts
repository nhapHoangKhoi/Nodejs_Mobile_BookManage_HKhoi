import cloudinary from "../config/cloudinary";

// https://res.cloudinary.com/de1rm4uto/image/upload/v1741568358/abcdefgh.png
// delete asset from cloudinary
//
export async function deleteAssetOutOfCloudinary(url: string, label: string = "the asset") {
  if(url && url.includes("res.cloudinary.com")) {
    try {
      // pop out the last then split by symbol dot "."
      const publicId = url.split("/").pop()?.split(".")[0]; 

      // CDN may still return the cached version until the cache expires (can take hours to days)
      // so we need { invalidate: true }
      await cloudinary.uploader.destroy(`${publicId}`, { invalidate: true });
    } 
    catch (error) {
      console.log(`Error deleting ${label} from cloudinary!`, error);
    }
  }
}