import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    busNumber: {
      type: String,
      trim: true,
    },

    totalSeats: {
      type: Number,
      min: 1,
    },

    type: {
      type: String,
      enum: ["seating", "sleeper"],
    },
    basePricePerKm: {
      type: Number,
      min: 0,
    },
    amenties: [{
      type: String,
      enum: ["WiFi", "AC", "Charging"],
    }],
  },
  {
    timestamps: true,
  },
);

export const Bus = mongoose.model("Bus", busSchema);
