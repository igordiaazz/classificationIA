import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

export const historyRouter = Router();

historyRouter.get("/", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));

    const [records, total] = await Promise.all([
      prisma.predictionHistory.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          filename: true,
          predictedClass: true,
          confidence: true,
          createdAt: true,
        },
      }),
      prisma.predictionHistory.count(),
    ]);

    return res.json({
      data: records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("History error:", error.message);
    return res.status(500).json({ error: "Erro ao buscar histórico." });
  }
});

historyRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const record = await prisma.predictionHistory.findUnique({
      where: { id: req.params.id },
    });

    if (!record) {
      return res.status(404).json({ error: "Registro não encontrado." });
    }

    return res.json(record);
  } catch (error: any) {
    console.error("History detail error:", error.message);
    return res.status(500).json({ error: "Erro ao buscar detalhe." });
  }
});

historyRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.predictionHistory.delete({
      where: { id: req.params.id },
    });
    return res.json({ message: "Registro removido." });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao remover registro." });
  }
});
