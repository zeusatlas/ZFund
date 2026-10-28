import fs from 'fs';

export interface IFileStorage {
  saveFile(file: Express.Multer.File): Promise<{ storedFilename: string; filePath: string }>;
  getFileStream(filePath: string): fs.ReadStream;
  deleteFile(filePath: string): Promise<void>;
  fileExists(filePath: string): boolean;
}
