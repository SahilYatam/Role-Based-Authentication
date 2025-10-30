import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { errorHandler, notFoundHandler } from "./middlewares/globalErrorHandler.js";

import authRouter from "./routers/auth.routes.js"
import sessionRouter from "./routers/session.routes.js"
import taskRouter from "./routers/task.routes.js"
import roleRouter from "./routers/role.routes.js"
import roleRequestRouter from "./routers/roleRequest.routes.js"


import { httpRequestsDuration, register } from "./utils/monitoring/metrics.js";

const app = express();

app.use(helmet());
app.use(cors());
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

app.set("trust proxy", true);

// global limiter, applies to all routes
const globalRateLimiting = limiter(15 * 60 * 1000, 1000) // 15 minutes, 1000 requests
app.use(globalRateLimiting);

const authLimiter = limiter(15 * 60 * 1000, 100);
const sessionLimiter = limiter(15 * 60 * 1000, 100);
const roleLimiter = limiter(15 * 60 * 1000, 500);

app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/session", sessionLimiter, sessionLimiter);
app.use("/api/v1/task", globalRateLimiting, taskRouter);
app.use("/api/v1/role", roleLimiter, roleRouter);
app.use("/api/v1/roleRequest", roleLimiter, roleRequestRouter);


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
app.get("/health", (req, res) => res.status(200).json({ status: "ok", service: serviceName }));


app.use(errorHandler);
app.use(notFoundHandler);

export {app}
