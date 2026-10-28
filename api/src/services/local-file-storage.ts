import fs from 'fs';
import path from 'path';
import { env } from '../config/env';
import { IFileStorage } from './file-storage.interface';

export class LocalFileStorage implements IFileStorage {
  private baseDir: string;

  constructor() {
    this.baseDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<{ storedFilename: string; filePath: string }> {
    return {
      storedFilename: file.filename,
      filePath: file.path,
    };
  }

  getFileStream(filePath: string): fs.ReadStream {
    return fs.createReadStream(filePath);
  }

  async deleteFile(filePath: string): Promise<void> {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }
}

export const localFileStorage = new LocalFileStorage();
