import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: Number,
      unique: true,
    },
    city: {
      type: String,
    },
    role: {
      type: String,
      enum: ["driver", "conductor"],
    },
  },
  { timestamps: true },
);

export const Employee = mongoose.model("Employee", employeeSchema);
