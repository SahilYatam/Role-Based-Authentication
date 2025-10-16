import client from "prom-client";

const register = new client.Registry();
client.collectDefaultMetrics({register});

export const httpRequestsDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.05, 0.1, 0.5, 1, 2, 5],
});

register.registerMetric(httpRequestsDuration);

export { client, register };