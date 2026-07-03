import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { env } from "../config/env.js";

export type StoredFile = {
  title: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  publicPath: string;
};

export class StorageService {
  async saveFile(file: Express.Multer.File): Promise<StoredFile> {
    await fs.mkdir(env.UPLOAD_DIR, { recursive: true });
    const ext = path.extname(file.originalname);
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^\p{L}\p{N}._-]+/gu, "-")
      .slice(0, 80);
    const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeBase}${ext}`;
    const storagePath = path.resolve(env.UPLOAD_DIR, fileName);
    await fs.writeFile(storagePath, file.buffer);

    return {
      title: file.originalname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storagePath,
      publicPath: `/uploads/${fileName}`
    };
  }

  // Local disk storage is used by default; hosted deployments can mount a
  // persistent volume or swap this service behind the same publicPath contract.
}

export const storageService = new StorageService();
