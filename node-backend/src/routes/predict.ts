import { Router, Request, Response } from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import { config } from "../config";
import { prisma } from "../prisma";

const upload = multer({ storage: multer.memoryStorage() });

export const predictRouter = Router();

predictRouter.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem enviada." });
    }

    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const pythonRes = await axios.post(`${config.pythonApiUrl}/predict`, form, {
      headers: form.getHeaders(),
    });

    const { classe, confianca } = pythonRes.data;
    const base64 = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    const record = await prisma.predictionHistory.create({
      data: {
        filename: req.file.originalname,
        predictedClass: classe,
        confidence: confianca,
        imageData: `data:${mimeType};base64,${base64}`,
      },
    });

    return res.json({
      id: record.id,
      classe,
      confianca,
      filename: req.file.originalname,
      createdAt: record.createdAt,
    });
  } catch (error: any) {
    console.error("Prediction error:", error.message);
    return res.status(500).json({
      error: "Erro ao processar a predição.",
      detail: error.response?.data?.detail || error.message,
    });
  }
});
