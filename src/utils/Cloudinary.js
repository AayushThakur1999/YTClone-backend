import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // console.log("file uploaded successfully to cloudinary", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    //remove the locally saved temporary file as the uploading failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const extractPublicIdFromUrl = (url) => {
  // Use regex to remove the base URL, version, and extension
  const regex = /\/v\d+\/(.+)\.\w+$/;
  const match = url.match(regex);

  if (match && match[1]) {
    return match[1]; // This is the public ID
  } else {
    console.error("Public ID not found in the URL");
    return null;
  }
};

const deleteImagefromCloudinary = async (url) => {
  try {
    const publicId = extractPublicIdFromUrl(url);
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log("Error deleting image:", error);
  }
};

export { uploadOnCloudinary, deleteImagefromCloudinary };
