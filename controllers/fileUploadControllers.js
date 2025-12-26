import { v2 as cloudinary } from "cloudinary";

export const FileUploader = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded, try again" });
    }

    // Function to upload single file via stream
    const streamUpload = (file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "chatimg" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(file.buffer);
      });
    };

    // Upload all files
    const uploadResults = await Promise.all(req.files.map(file => streamUpload(file)));
    const urls = uploadResults.map(r => r.secure_url);

    console.log("Uploaded URLs:", urls); 
    res.json({ urls });  

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
