import mongoose from "mongoose";
import { MONGO_URI, DB_NAME } from "#config";

export const connectDb = async (): Promise<void> => {
  const client = await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  console.log("Connected to MongoDB:", client.connection.name);
};
