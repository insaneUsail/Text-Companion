import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

const uploadToCloudinary = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "textCompanion/books",
        resource_type: "image",
        public_id: fileName.replace(".pdf", ""),
        format: "pdf",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No PDF uploaded",
      });
    }

    const safeName = req.file.originalname
      .replace(/\s+/g, "-")
      .replace(".pdf", "");

    const uniqueName = `${Date.now()}-${safeName}`;

    const result = await uploadToCloudinary(
      req.file.buffer,
      uniqueName
    );

    res.json({
      message: "PDF uploaded successfully",
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    res.status(500).json({
      error: "Upload failed",
      details: error.message,
    });
  }
});

export default router;