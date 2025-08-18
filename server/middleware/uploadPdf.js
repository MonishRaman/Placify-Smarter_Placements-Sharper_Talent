import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || "");
    const filename = `${unique}${ext}`;
    console.log(`[uploadPdf] Saving file as: ${filename}`);
    cb(null, filename);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ["application/pdf", "text/plain"]; // extend later (docx)
  if (allowed.includes(file.mimetype)) {
    console.log(`[uploadPdf] Accepted file type: ${file.mimetype}`);
    return cb(null, true);
  }
  console.error(`[uploadPdf] Rejected file type: ${file.mimetype}`);
  cb(new Error("Only PDF or TXT files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB cap for now
});

upload.singleErrorHandler = (err, req, res, next) => {
  if (err) {
    console.error(`[uploadPdf] Multer error: ${err.message}`);
    return res.status(400).json({ error: err.message });
  }
  next();
};

export default upload;
