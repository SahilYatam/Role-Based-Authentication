import { connectDB } from "./config/db.js";
import mongoose from "mongoose";
import { app, loadRoutes } from "./app.js";
import logger from "./utils/monitoring/logger.js";
import { connectRabbitMQ } from "./config/rabbitMq.config.js";
import { startConsumer } from "./message-broker/consumer.js";

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

  console.log(`🛑 Shutting down due to ${signal}...`);
  logger.info(`🛑 Shutting down due to ${signal}...`);

  const shutdownTimer = setTimeout(() => {
    console.error("⏱ Force shutdown after timeout");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);

  try {
    if (httpServer) {
      await new Promise((resolve) => httpServer.close(() => resolve()));
      console.log("HTTP server closed");
    }

    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log("MongoDB connection closed");
    }

    await shutdownLogger();
    clearTimeout(shutdownTimer);
    console.log("Shutdown complete");
    process.exit(0);
  } catch (err) {
    clearTimeout(shutdownTimer);
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

const handleFatalError = async (type, error) => {
  console.error(`🚨 ${type.toUpperCase()}:`, error);
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
    console.log("🔌 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected");

    console.log("📨 Connecting to RabbitMQ...");
    await connectRabbitMQ();
    console.log("✅ RabbitMQ connected");

    console.log("📨 Starting RabbitMQ consumer...");
    await startConsumer();
    console.log("✅ RabbitMQ consumer started");

    console.log("📁 Loading routes...");
    await loadRoutes();
    console.log("✅ Routes loaded");

    console.log("🚀 Seeding default roles...");
    const { default: initRoles } = await import("./services/role.service.js");
    await initRoles();
    console.log("✅ Roles seeded");

    console.log("🚀 Ensuring unique SuperAdmin index...");
    const { ensureUniqueSuperAdminIndex } = await import("./startup/setupIndexes.js");
    await ensureUniqueSuperAdminIndex();
    console.log("✅ SuperAdmin index ensured");

    console.log(`🚀 Starting HTTP server on port ${port}...`);
    httpServer = await new Promise((resolve, reject) => {
      const server = app.listen(port, () => {
        console.log(`🚀 Server is running on PORT: ${port}`);
        resolve(server);
      });
      server.on("error", reject);
    });
  } catch (err) {
    console.error("❌ Server startup error:", err);
    await gracefulShutdown("STARTUP_FAILURE");
  }
};

startServer();
