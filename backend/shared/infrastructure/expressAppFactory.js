import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import cron from "node-cron";

import logger from "../utils/monitoring/logger.js"

import { errorHandler, notFoundHandler } from "../middlewares/globalErrorHandler.js";
import { httpRequestsDuration, register } from "../utils/monitoring/metrics.js"

/**
 * @typedef {Object} RouteConfig
 * @property {string} path
 * @property {import('express').Router} router
 * @property {boolean} [useRateLimit]
 * @property {ReturnType<typeof rateLimit>} [customLimiter]
 */

/**
 * @typedef {Object} CornJobConfig
 * @property {string} schedule
 * @property {Function} task
 * @property {string} [name]
 */

/**
 * Create a configured Express app for a microservice
*/

export function createExpressApp ({
    serviceName,
    routes = [],
    cronJobs = [],
    rateLimiting = {windowMs: 15 * 60 * 1000, max: 100},
}) {
    const app = express();

    // --- Security & core middlewares ---
    app.use(helmet());
    app.use(cors());
    app.use(morgan("dev"));
    app.use(express.json({limit: "20kb"}));
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());

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

    // --- Rate limiter ---
    const limiter = rateLimit(rateLimiting);

    // --- Register routes ---
    routes.forEach(({path, router, useRateLimit = true, customLimiter}) => {
        if(!router) return;

        const middlewares = [];

        if(useRateLimit){
            const rateLimitMiddleware = customLimiter ? rateLimit(customLimiter) : limiter;

            middlewares.push(rateLimitMiddleware);
        }
        middlewares.push(router);
        app.use(path, ...middlewares);

        logger.info(`✅ ${serviceName} registered route: ${path}`);
    });

    // --- Metrics endpoint ---
    app.get("/metrics", async(req, res) => {
        res.set("Content-Type", client.register.contentType);
        res.send(await register.metrics());
    });

    // --- Health check endpoints ---
    app.get("/health", (req, res) => res.status(200).json({ status: "ok", service: serviceName }));

    // --- Error handling ---
    app.use(notFoundHandler);
    app.use(errorHandler);

    // --- Cron jobs ---
    cronJobs.forEach(({ schedule, task, name }) => {
        cron.schedule(schedule, async() => {
            logger.info(`⏰ ${serviceName} running job: ${name || schedule}`);
            await task();
        });
    });

    return app;
}

