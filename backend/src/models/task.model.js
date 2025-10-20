import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    taskName: {
        type: String,
        required: true,
        trim: true
    },

    taskDescription: {
        type: String,
        required: true,
        trim: true
    },

    isCompleted: {
        type: Boolean,
        default: false
    }

}, {timestamps: true});

export const Task = mongoose.model("Task", taskSchema);