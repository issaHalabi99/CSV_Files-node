import express from "express";
import * as fileController from "../controllers/file.js";

const router = express.Router();

router.post("/csv_files", fileController.upload);

router.get("/csv_files", fileController.listData);

router.get("/csv_files/:fileId", fileController.getFileData);

router.delete("/csv_files/:fileId", fileController.deleteFile);

export default router;
