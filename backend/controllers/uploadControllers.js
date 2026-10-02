const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,   // Fixed: no spaces or `-` in env names
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype)) {
      const error = new Error("Only JPEG, PNG, WebP, and GIF images are supported");
      error.statusCode = 400;
      return callback(error);
    }
    return callback(null, true);
  },
});
const adminImageUpload = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      return res.status(error.statusCode || (error.code === "LIMIT_FILE_SIZE" ? 413 : 400))
        .json({ message: error.code === "LIMIT_FILE_SIZE" ? "Image must be 5 MB or smaller" : error.message });
    }
    return next();
  });
};

// Function to stream upload to Cloudinary
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error || new Error("Image provider did not return an upload result"));
      }
    });
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// Controller function for uploading
const uploads = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(503).json({ message: "Image upload is not configured on this server" });
    }

    const result = await streamUpload(req.file.buffer);
    return res.status(201).json({ imageUrl: result.secure_url });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while uploading image",
      error: error.message,
    });
  }
};

module.exports = {
  adminImageUpload,
  uploads,
};
