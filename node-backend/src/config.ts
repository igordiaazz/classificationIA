import path from "path";

const envPath = path.resolve(__dirname, "..", ".env");
require("dotenv").config({ path: envPath });

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  pythonApiUrl: process.env.PYTHON_API_URL || "http://localhost:8000",
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://user:password@localhost:5432/classification_ia?schema=public",
};
