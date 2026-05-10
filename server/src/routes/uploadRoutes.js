import express from "express";
import multer from "multer";

import { supabase } from "../config/supabase.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No PDF uploaded",
      });
    }

    const safeName =
      req.file.originalname.replace(/\s+/g, "-");

    const filePath =
      `${Date.now()}-${safeName}`;

    const { error } =
      await supabase.storage
        .from("books")
        .upload(filePath, req.file.buffer, {
          contentType: "application/pdf",
          upsert: false,
        });

    if (error) {
      throw error;
    }

    const { data } =
      supabase.storage
        .from("books")
        .getPublicUrl(filePath);

    res.json({
      message: "PDF uploaded successfully",
      fileName: req.file.originalname,
      fileUrl: data.publicUrl,
      storagePath: filePath,
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