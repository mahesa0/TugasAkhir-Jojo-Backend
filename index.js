import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./src/routes/UserRoute.js";
import alternatifRoutes from "./src/routes/AlternatifRoute.js";
import kriteriaRoutes from "./src/routes/KriteriaRoute.js";
import nilaiCripsRoutes from "./src/routes/NilaiCripsRoute.js";
import perhitunganRoutes from "./src/routes/PerhitunganRoute.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "*"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

const PORT = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Routes
app.use("/users", userRoutes);
app.use("/alternatif", alternatifRoutes);
app.use("/kriteria", kriteriaRoutes);
app.use("/crips", nilaiCripsRoutes);
app.use("/perhitungan", perhitunganRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});