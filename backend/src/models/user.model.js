import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      trim: true,
    },
    email: {
      type: mongoose.Schema.Types.String,
    },
    phone: {
      type: mongoose.Schema.Types.Number,
    },
    password: {
      type: mongoose.Schema.Types.String,
    },
    role: {
      type: mongoose.Schema.Types.String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
