import mongoose from "mongoose";

const roleRequestchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    requestedRole: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true,
    },

    status: {
        type: String,
        enums: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },

    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

}, {timestamps: true});

roleRequestchema.index({user: 1, requestedRole: 1, status: 1}, {unique: true, partialFilterExpression: {status: "Pending"}});

export const RoleRequest = mongoose.model("RoleRequest",roleRequestchema);