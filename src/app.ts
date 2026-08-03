import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { errorHandler, AppError } from "./middlewares/errorHandler";
import { ApiResponse } from "./utils/apiResponse";
import cmsRouter from "./routes";
import uploadRoutes from "./routes/upload.routes";
import adminRoutes from "./routes/admin.routes";
import featuredVideoRoutes from "./routes/featuredVideo.routes";

const app: Express = express();

// 1. Logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// 2. Security Middlewares
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: true, // Allow any origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// 3. Rate Limiting (Prevent DDoS/abuse in production while allowing seamless reading)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Increased limit for production clients
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "GET", // Allow read requests without rate limiting block
});

if (process.env.NODE_ENV === "production") {
  app.use("/api", limiter);
}

// 4. Parsing Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// 5. Mount API Routes
app.use("/api/v1/featured-videos", featuredVideoRoutes);
app.use("/api/v1/featuredVideos", featuredVideoRoutes);
app.use("/api/v1/reels", featuredVideoRoutes);
app.use("/api/v1/cms", cmsRouter);
app.use("/api/v1", cmsRouter);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/media", uploadRoutes);

// 6. Health Check Route
app.get("/health", (req: Request, res: Response) => {
  ApiResponse.success(res, "TechMaster CMS Backend is healthy.", {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 7. 404 Route Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 8. Centralized Global Error Handler
app.use(errorHandler);

export default app;
