import mongoose from "mongoose";

require("dotenv").config();

const dbUrl: string = process.env.DB_URL || "";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("connected to mongodb")
    );
    await mongoose
      .connect(dbUrl)
      .then((data: any) => {
        console.log(`database connected with ${data.connection.host}`);
      })
      .catch((error) => {
        // If there is an error, print the error message to the console
        console.error("Connection error:", error);
      });
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error);
    setTimeout(connectDB, 500);
  }
};

export default connectDB;
