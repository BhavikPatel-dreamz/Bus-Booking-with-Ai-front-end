import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.DB_URL}/quickbus`);
    console.log(`mongodb connect on ${connection.connection.host}`);
  } catch (error) {
    console.error("Db error:", error);
  }
};
