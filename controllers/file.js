import * as fs from "fs";
import * as path from "path";
import * as csv from "fast-csv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import File from "../models/file.js";
import { fileURLToPath } from "url";

export async function upload(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error("No file provided.");
      error.statusCode = 422;
      throw error;
    }
    const fileUrl = req.file.path;
    const originalName = req.file.originalname;
    const filename = req.file.filename;
    const data = [];
    fs.createReadStream(path.join(__dirname, "..", "uploads", filename))
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => data.push(row))
      .on("end", async () => {
        const file = new File({
          fileUrl: fileUrl,
          name: originalName,
          data: data,
        });
        await file.save();
        res.status(201).json({
          message: "file added successfully!",
          file: file,
        });
      });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function listData(req, res, next) {
  try {
    const files = await File.find()
      .select("_id name createdAt")
      .sort({ createdAt: -1 });
    if (!files) {
      const error = new Error("Could not find files.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "files fetched.", files });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function getFileData(req, res, next) {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId)
      .select("-fileUrl -updatedAt")
      .sort({ createdAt: -1 });
    if (!file) {
      const error = new Error("Could not find file.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "file fetched.", file });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function deleteFile(req, res, next) {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);
    if (!file) {
      const error = new Error("Could not find file.");
      error.statusCode = 404;
      throw error;
    }
    clearImage(file.fileUrl);
    await File.findByIdAndDelete(fileId);
    res.status(200).json({ message: "Deleted post." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => (err ? console.log(err) : null));
};
