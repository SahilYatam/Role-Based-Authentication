import { app } from "./app.js";
import logger from "./utils/monitoring/logger.js";
import { connectDB } from "./config/db.js";
import mongoose from "mongoose";

// Ensure all logger transports are flushed before exit
const shutdownLogger = async () => {
    return new Promise((resolve) => {
        for (const transport of logger.transports) {
            if (typeof transport.close === "function") transport.close();
            else if (typeof transport.end === "function") transport.end();
        }
        resolve();
    });
};

let httpServer;
let isShuttingDown = false;
let SHUTDOWN_TIMEOUT = 1000;

let port = process.env.PORT || 8000;

const startServer = async () => {
    try {
        logger.info(`🔌 Connecting DB...`);

        await connectDB();

        httpServer = await new Promise((resolve, reject) => {
            const server = app.listen(port, () => {
                isServerReady = true; // server + db ready
                logger.info(
                    `🚀 Server is running on PORT: ${port}`
                );
                resolve(server);
            });

            server.on("error", (err) => {
                logger.error(`❌ Failed to start server: ${err.message}\n${err.stack}`);
                reject(err);
            });
        });
    } catch (error) {
        logger.error(`❌ Server startup error ${error.message}\n${error.stack}`);
        if (exitOnError) process.exit(1);
        throw error;
    }
}

startServer();

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    if(isShuttingDown){
        logger.info("⚠️ Shutdown already in progress, ignoring signal");
        return;
    };

    isShuttingDown = true;
    logger.info(`🛑 Shutting down Server (${signal})...`);

    const shutdownTimer = setTimeout(() => {
        logger.error("⏱ Force shutdown after timeout");
        process.exit(1);
    }, SHUTDOWN_TIMEOUT);

    try {
        if(httpServer){
            await new Promise((resolve) => httpServer.close(() => resolve()));
            logger.info("🛑 HTTP server closed");
        }

        if(mongoose.connection.readyState === 1){
            await mongoose.disconnect();
            logger.info("🔌 MongoDB connection closed")
        }

        await shutdownLogger();
        clearTimeout(shutdownTimer);
        logger.info(`✅ Shutdown complete`);
        process.exit(0);
    } catch (error) {
        clearTimeout(shutdownTimer);
        logger.error(`Error during shutdown: ${error.message}`);
        process.exit(1);
    }
}

const handleFatalError = async (type, error) => {
    if(isShuttingDown) return;
    logger.error(`🚨 ${type.toUpperCase()} ${error.message}`);
    logger.error(error.stack);
    await gracefulShutdown(type);
}

// Register process events
process.on("uncaughtException", (err) => handleFatalError("uncaughtException", err));
process.on("unhandledRejection", (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    handleFatalError("unhandledRejection", error);
});

process.once("SIGINT", () => gracefulShutdown("SIGINT"));
process.once("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.once("SIGQUIT", () => gracefulShutdown("SIGQUIT"));

process.on("exit", (code) => {
    if (!isShuttingDown) logger.info(`Server exiting with code ${code}`);
});
