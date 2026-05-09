import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("pdf"), (req, res) => {
 const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

res.json({
  message: "PDF uploaded successfully",
  fileName: req.file.filename,
  fileUrl,
});
});

export default router;