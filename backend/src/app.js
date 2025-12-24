import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { errorHandler, notFoundHandler } from "./middlewares/globalErrorHandler.js";

import { httpRequestsDuration, register } from "./utils/monitoring/metrics.js";

const app = express();

app.use(helmet());
app.use(cors({
    origin: "https://role-based-authentication-c3q0k881u-sahils-projects-8a4effa5.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}))
app.use(morgan("dev"));
app.use(express.json({limit: "20kb"}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

function limiter (windowMs, max) {
    return rateLimit ({
        windowMs,
        max,
        message: "Too many requests, please try again later.",
        standardHeaders: true,
        legacyHeaders: false
    });
}

app.set("trust proxy", 1);

// global limiter, applies to all routes
const globalRateLimiting = limiter(15 * 60 * 1000, 1000) // 15 minutes, 1000 requests
app.use(globalRateLimiting);

const authLimiter = limiter(15 * 60 * 1000, 100);
const sessionLimiter = limiter(15 * 60 * 1000, 100);
const roleLimiter = limiter(15 * 60 * 1000, 500);

// LAZY LOAD ROUTES - Importing dynamically
const loadRoutes = async () => {
    const authRouter = (await import("./routers/auth.routes.js")).default;
    const userRouter = (await import("./routers/user.routes.js")).default;
    const sessionRouter = (await import("./routers/session.routes.js")).default;
    const taskRouter = (await import("./routers/task.routes.js")).default;
    const roleRouter = (await import("./routers/role.routes.js")).default;
    const roleRequestRouter = (await import("./routers/roleRequest.routes.js")).default;

    app.use("/api/v1/auth", authLimiter, authRouter);
    app.use("/api/v1/user", authLimiter, userRouter);
    app.use("/api/v1/session", sessionLimiter, sessionRouter);
    app.use("/api/v1/task", globalRateLimiting, taskRouter);
    app.use("/api/v1/role", roleLimiter, roleRouter);
    app.use("/api/v1/roleRequest", roleLimiter, roleRequestRouter);

    app.use(errorHandler);
    app.use(notFoundHandler);
};


// --- Metrics middleware ---
app.use((req, res, next) => {
    const end = httpRequestsDuration.startTimer();
    res.on("finish", () => {
        end({
            method: req.method,
            route: req.route?.path || req.path,
            status_code: res.statusCode,
        });
    });
    next();
});

// --- Metrics endpoint ---
app.get("/metrics", async(req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.send(await register.metrics());
});

    // --- Health check endpoints ---
app.get("/api/v1/health", (req, res) => res.status(200).json({ status: "ok" }));

export {app, loadRoutes}
