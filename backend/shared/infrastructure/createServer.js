import dotenv from "dotenv";
dotenv.config();

import logger from "../utils/monitoring/logger.js";

let httpServer;
let currentServiceName;
let currentDisconnectDatabase;
let isShuttingDown = false;
let databaseName;
let isDatabaseConnected = false;
let isServerReady = false;

const SHUTDOWN_TIMEOUT = 10000; // 10 seconds;

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

export const createServer = async (
    app,
    port,
    serviceName,
    DB_URI,
    connectDatabase,
    disconnectDatabase,
    dbName,
    { exitOnError = true } = {}
) => {
    currentServiceName = serviceName;
    currentDisconnectDatabase = disconnectDatabase;
    databaseName = dbName;

    try {
        logger.info(`🔌 Connecting DB for ${serviceName}...`);

        await connectDatabase(DB_URI);
        isDatabaseConnected = true;

        logger.info(`✅ ${dbName.toUpperCase()} connected for ${serviceName}`);

        httpServer = await new Promise((resolve, reject) => {
            const server = app.listen(port, () => {
                isServerReady = true; // server + db ready
                logger.info(
                    `🚀 ${serviceName} service running on PORT: ${port}`
                );
                resolve(server);
            });

            server.on("error", (err) => {
                logger.error(`❌ Failed to start server: ${err.message}\n${err.stack}`);
                reject(err);
            });
        });
    } catch (error) {
        logger.error(`❌ Startup error in ${serviceName}: ${error.message}\n${error.stack}`);
        if (exitOnError) process.exit(1);
        throw error;
    }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    if (isShuttingDown) {
        logger.info("⚠️ Shutdown already in progress, ignoring signal");
        return;
    }

    isShuttingDown = true;
    logger.info(`🛑 Shutting down ${currentServiceName} (${signal})...`);

    const shutdownTimer = setTimeout(() => {
        logger.error("⏱ Force shutdown after timeout");
        process.exit(1);
    }, SHUTDOWN_TIMEOUT);

    try {
        if (httpServer) {
            await new Promise((resolve) => httpServer.close(() => resolve()));
            logger.info("🛑 HTTP server closed");
        }

        if (currentDisconnectDatabase) {
            await currentDisconnectDatabase();
            logger.info(`🔌 ${databaseName} connection closed`);
        }

        await shutdownLogger();
        clearTimeout(shutdownTimer);

        logger.info(`✅ ${currentServiceName} shutdown complete`);
        process.exit(0);
    } catch (error) {
        clearTimeout(shutdownTimer);
        logger.error(`❌ Error during shutdown: ${error.message}`);
        process.exit(1);
    }
};

// Handle fatal errors
const handleFatalError = async (type, error) => {
    if (isShuttingDown) return;
    logger.error(`🚨 ${type.toUpperCase()} in ${currentServiceName}: ${error.message}`);
    logger.error(error.stack);
    await gracefulShutdown(type);
};

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
    if (!isShuttingDown) logger.info(`${currentServiceName} exiting with code ${code}`);
});
