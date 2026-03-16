import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    ogroute:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Route'
    },
    stops: [
      {
        name: {
          type: String,
        },
        predistance: {
          type: Number,
        },
        pretime: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Route = mongoose.model("Route", routeSchema);
