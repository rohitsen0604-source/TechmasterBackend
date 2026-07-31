import mongoose from "mongoose";
import { User } from "../models/User";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is not defined in the environment variables.");
      process.exit(1);
    }

    mongoose.connection.on("connected", () => {
      console.log("Successfully connected to MongoDB database: techmaster");
    });

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB connection disconnected.");
    });

    await mongoose.connect(mongoUri);

    // Seed default admin for login verification
    const adminExists = await User.findOne({ email: "admin@gmail.com" });
    if (!adminExists) {
      await User.create({
        fullName: "Super Admin",
        email: "admin@gmail.com",
        password: "Admin@123",
        role: "Super Admin",
        status: "Active",
      });
      console.log("Seeded default admin credentials: admin@gmail.com / Admin@123");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
