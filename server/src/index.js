import express from "express";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/", testRoutes);

app.use("/api/upload", uploadRoutes);
app.use("/api/ai", aiRoutes);


app.listen(5000, () => {
  console.log("Server started on port 5000");
});