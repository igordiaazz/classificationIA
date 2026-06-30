import express from "express";
import cors from "cors";
import { config } from "./config";
import { predictRouter } from "./routes/predict";
import { historyRouter } from "./routes/history";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/predict", predictRouter);
app.use("/api/history", historyRouter);

app.listen(config.port, () => {
  console.log(`Node backend running on http://localhost:${config.port}`);
});
