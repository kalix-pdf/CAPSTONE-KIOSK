import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage instead of CloudinaryStorage
const upload = multer({ storage: multer.memoryStorage() });

export const uploadToCloudinary = (
  fileBuffer,
  folder = "events",
  publicId = null
) => {
  return new Promise((resolve, reject) => {

    let cleanPublicId = publicId;
    if (publicId && publicId.includes("/")) {
      cleanPublicId = publicId.split("/").pop();
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        ...(cleanPublicId && {
          public_id: cleanPublicId,
          overwrite: true,
          invalidate: true,
        }),
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { cloudinary, upload };