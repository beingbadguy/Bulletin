import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cloudinaryConnect from "./config/cloudinary.js";
import fileUpload from "express-fileupload";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import newsletterRoutes from "./routes/newsletter.routes.js";
import saveRoutes from "./routes/save.routes.js";
import articleRoutes from "./routes/article.routes.js";
import dbConnection from "./config/dbConnect.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://bulletin-is7s.onrender.com",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/newsletter", newsletterRoutes);
app.use("/api/v1/article", articleRoutes);
app.use("/api/v1/article", saveRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  cloudinaryConnect();
  dbConnection();
  console.log(`Server is running on port ${PORT}`);
});
