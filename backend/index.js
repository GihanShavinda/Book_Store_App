import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from "./src/routes/authRoutes.js";
import bookRoutes from "./src/routes/bookRoutes.js";

import { connectDB } from "./src/lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});