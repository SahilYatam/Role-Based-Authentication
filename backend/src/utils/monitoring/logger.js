import { createLogger, format, transports } from "winston";
import LokiTransport from "winston-loki";
import DailyRotateFile from "winston-daily-rotate-file";

const logFormat = format.combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss:SSS'
    }),
    format.errors({stack: true}), 
    format.json(),
    format.printf(({timestamp, level, message}) => {
        return `${timestamp} [${level.toLocaleUpperCase()}]: ${message}`
    })
);

const logger = createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss:SSS'
                }),
                format.printf(({timestamp, level, message}) => {
                    return `${timestamp} [${level.toLocaleUpperCase ()}]: ${message}`
                })
            )
        }),

        new DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: "10m",
            maxFiles: "14d",
            auditFile: 'logs/audit.json'
        }),

        new DailyRotateFile({
            level: 'error',
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: "5m",
            maxFiles: "30d",
            auditFile: 'logs/error-audit.json'
        }),

        new LokiTransport({
            host: "http://127.0.0.1:3100"
        }),
    ],

    exceptionHandlers: [
        new transports.File({filename: 'logs/exceptions.log'})
    ],
    rejectionHandlers: [
        new transports.File({filename: 'logs/rejections.log'})
    ]
});

import fs from 'fs';
if(!fs.existsSync('logs')){
    fs.mkdirSync('logs', {recursive: true});
} 

export default logger;
