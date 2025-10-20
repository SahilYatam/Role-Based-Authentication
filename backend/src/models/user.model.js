import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true
    },

    name: {
        type: String,
        index: true,
        trim: true
    },

    password: {
        type: String,
    },

    role: {
        type: String,
        enum: ["SUPER_ADMIN", "ADMIN", "EDITOR", "MEMBER"],
        default: "MEMBER"
    },

    isEmailVerifed: {
        type: Boolean,
        default: false
    },
    
    resetPasswordToken: {
        type: String,
        unique: true,
    },

    resetPasswordExpiresAt: {
        type: Date,
    }

}, {timestamps: true});

export const User = mongoose.model("User", userSchema);