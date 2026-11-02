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

// Campaign cover images: images only, served publicly from their own directory.
export const CAMPAIGN_IMAGE_DIR = path.resolve(process.cwd(), 'storage/campaign-images');
if (!fs.existsSync(CAMPAIGN_IMAGE_DIR)) {
  fs.mkdirSync(CAMPAIGN_IMAGE_DIR, { recursive: true });
}

const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export const campaignImageUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, CAMPAIGN_IMAGE_DIR),
    // The extension comes from the verified mime type, not from the client filename.
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${uuidv4()}${IMAGE_EXTENSIONS[file.mimetype] ?? '.jpg'}`),
  }),
  fileFilter: (_req, file, cb) => {
    if (!IMAGE_EXTENSIONS[file.mimetype]) {
      return cb(new BadRequestError('Cover image must be a JPG, PNG or WebP file.'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});
