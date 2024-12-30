import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the database");
  } catch (err) {
    console.log("Not able to connect to the database");
    console.error("Error connecting to the database", err);
    process.exit(1);
  }
};

export default dbConnection;
