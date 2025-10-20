import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    refreshToken: {
        type: String,
        required: true,
        unique: true,
    },

    isActive: {
        type: Boolean,
        default: false,
    },

    expiresAt: {
        type: Date,
        required: true
    },

    lastActivity: {
        type: Date,
        default: Date.now()
    }

}, {timestamps: true});

export const Session = mongoose.model("Session", sessionSchema);