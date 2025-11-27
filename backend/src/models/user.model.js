import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },

    name: {
      type: String,
      index: true,
      trim: true,
    },

    password: {
      type: String,
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },

    isEmailVerifed: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: {
      type: String,
      sparse: true,
    },

    resetPasswordExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
