import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../config/env';
import { BadRequestError } from '../errors/app-error';

// Ensure upload directory exists
const uploadPath = path.resolve(process.cwd(), env.UPLOAD_DIR);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${uuidv4()}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const allowed = env.ALLOWED_FILE_TYPES.split(',').map((t) => t.trim().toLowerCase());
  if (!allowed.includes(file.mimetype.toLowerCase())) {
    return cb(
      new BadRequestError(`File type ${file.mimetype} is not allowed. Allowed types: ${env.ALLOWED_FILE_TYPES}`)
    );
  }
  cb(null, true);
};

export const documentUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
  },
});
