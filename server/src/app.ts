import express from "express";
import cors from "cors";
import leadRoutes from "./routes/lead.routes.js";
import noteRoutes from "./routes/note.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Lead Api is running",
  });
});
app.use("/api/leads", leadRoutes);
app.use("/api/leads", noteRoutes);

export default app;
