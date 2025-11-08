import multer from "multer";
import path from "path";
import fs from "fs";
import logger from '../utils/logger.js';

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    logger.debug(`[uploadImage] Created upload directory: ${uploadDir}`);
} else {
    logger.debug(`[uploadImage] Upload directory exists: ${uploadDir}`);
}

// Storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = uniqueSuffix + path.extname(file.originalname);
        logger.debug(`[uploadImage] Saving file as: ${filename}`);
        cb(null, filename);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        logger.debug(`[uploadImage] Accepted file: ${file.originalname} (${file.mimetype})`);
        cb(null, true);
    } else {
        logger.error(`[uploadImage] Rejected file: ${file.originalname} (${file.mimetype}) - Only images allowed`);
        cb(new Error("Only images allowed"), false);
    }
};

export const upload = multer({ storage, fileFilter });