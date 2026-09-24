import express from "express";
import cors from "cors";
import leadRoutes from "./routes/lead.routes.js";
import noteRoutes from "./routes/note.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { basicAuthMiddleware } from "./middleware/auth.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Lead Api is running",
  });
});

app.use("/api/leads", basicAuthMiddleware);
app.use("/api/leads", leadRoutes);
app.use("/api/leads", noteRoutes);

app.use(errorMiddleware);

export default app;
