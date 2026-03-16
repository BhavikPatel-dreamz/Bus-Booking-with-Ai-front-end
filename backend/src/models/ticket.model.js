import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },
    pnr: {
      type: String,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    seats: [Number],
    passengers: [
      {
        name: {
          type: String,
        },
        age: {
          type: Number,
        },
        gender: {
          type: String,
          enum: ["male", "female"],
        },
      },
    ],
    ticketdate: {
      type: String,
    },
    status: {
      type: String,
      enum: ["booked", "cancelled"],
    },
    totalamount: {
      type: Number,
    },
    paymentstatus: {
      type: String,
      enum: ["completed", "pending"],
    },
  },
  { timestamps: true },
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
