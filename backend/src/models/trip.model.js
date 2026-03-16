import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
    },
    departureTime: {
      type: String,
    },
    arrivalTime: {
      type: String,
    },
    minimumRevenue: {
      type: Number,
    },
    days: [Number],
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    conductor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true,
  },
);

export const Trip = mongoose.model("Trip", tripSchema);
