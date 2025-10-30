import mongoose from "mongoose";

const loginAttemptSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    ip: {
        type: String,
        required: true
    },

    attempts: {
        type: Number,
        default: 0,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    lastAttemptAt: {
        type: Date
    },

    isBlocked: {
        type: Boolean,
        default: false,
    },

    blockedUntil: {
        type: Date
    },

    permanentlyBlocked: {
        type: Boolean,
        default: false
    },

    blockReason: {
        type: String
    }

}, {timestamps: true});

loginAttemptSchema.index({email: 1, ip: 1}, {unique: true});

export const LoginAttempt = mongoose.model("LoginAttempt", loginAttemptSchema);
