import { connectDB } from "./config/db.js";
import mongoose from "mongoose";
import { app, loadRoutes } from "./app.js";
import logger from "./utils/monitoring/logger.js";
import { connectRabbitMQ } from "./config/rabbitMq.config.js";

const port = process.env.PORT || 8000;

let httpServer;
let isShuttingDown = false;
const SHUTDOWN_TIMEOUT = 10000;

// Flush logger before exit
const shutdownLogger = async () => {
    return new Promise((resolve) => {
        for (const transport of logger.transports) {
            if (typeof transport.close === "function") transport.close();
            else if (typeof transport.end === "function") transport.end();
        }
        resolve();
    });
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.info(`🛑 Shutting down due to ${signal}...`);

    const shutdownTimer = setTimeout(() => {
        logger.error("⏱ Force shutdown after timeout");
        process.exit(1);
    }, SHUTDOWN_TIMEOUT);

    try {
        if (httpServer) {
            await new Promise((resolve) => httpServer.close(() => resolve()));
            logger.info("HTTP server closed");
        }

        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            logger.info("MongoDB connection closed");
        }

        await shutdownLogger();
        clearTimeout(shutdownTimer);
        logger.info("Shutdown complete");
        process.exit(0);
    } catch (err) {
        clearTimeout(shutdownTimer);
        logger.error("Error during shutdown:", err);
        process.exit(1);
    }
};

const handleFatalError = async (type, error) => {
    logger.error(`🚨 ${type.toUpperCase()}:`, error);
    await gracefulShutdown(type);
};

process.on("uncaughtException", (err) => handleFatalError("uncaughtException", err));
process.on("unhandledRejection", (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    handleFatalError("unhandledRejection", error);
});

process.once("SIGINT", () => gracefulShutdown("SIGINT"));
process.once("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.once("SIGQUIT", () => gracefulShutdown("SIGQUIT"));

// Main startup
const startServer = async () => {
    try {
        logger.info("🔌 Connecting to MongoDB...");
        await connectDB();
        logger.info("✅ MongoDB connected");

        logger.info("📨 Connecting to RabbitMQ...");
        await connectRabbitMQ();
        logger.info("✅ RabbitMQ connected");

        logger.info("🚀 Seeding default roles...");
        const { default: initRoles } = await import("./services/role.service.js");
        await initRoles();
        logger.info("✅ Roles seeded");

        logger.info("🚀 Ensuring unique SuperAdmin index...");
        const { ensureUniqueSuperAdminIndex } = await import("./startup/setupIndexes.js");
        await ensureUniqueSuperAdminIndex();
        logger.info("✅ SuperAdmin index ensured");

        logger.info("📁 Loading routes...");
        await loadRoutes();
        logger.info("✅ Routes loaded");

        try {
            logger.info("👷 Starting background worker...");
            const { startWorker } = await import("./worker.js")
            await startWorker();
            logger.info("✅ Worker started");
        } catch (err) {
            logger.error("❌ Worker failed to start, continuing without it", err);
        }


        logger.info(`🚀 Starting HTTP server on port ${port}...`);
        httpServer = await new Promise((resolve, reject) => {
            const server = app.listen(port, () => {
                logger.info(`🚀 Server is running on PORT: ${port}`);
                resolve(server);
            });
            server.on("error", reject);
        });
    } catch (err) {
        logger.error("❌ Server startup error:", err);
        await gracefulShutdown("STARTUP_FAILURE");
    }
};

startServer();
