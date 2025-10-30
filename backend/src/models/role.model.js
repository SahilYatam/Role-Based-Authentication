import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            immutable: true
        },

        name: {
            type: String,
            required: true,
            unique: true
        },

        description: { type: String },

        permissions: {
            adminPanelAccess: { type: Boolean, default: false },
            canApproveRoles: { type: Boolean, default: false },
            task: {
                create: { type: Boolean, default: false },
                read: { type: Boolean, default: true },
                update: { type: Boolean, default: false },
                delete: { type: Boolean, default: false },
                markComplete: { type: Boolean, default: true },
            },
        },
    },
    { timestamps: true }
);

export const Role = mongoose.model("Role", roleSchema);
