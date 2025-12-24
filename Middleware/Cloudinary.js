import dotenv from "dotenv";
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
dotenv.config()


// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports=upload;
