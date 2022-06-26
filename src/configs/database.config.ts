import mongoose from "mongoose";
const URI_DB = `${process.env.MONGODB_CONNECTION}/${process.env.MONGO_DB}?authSource=admin`;
const connectDatabase = () => {
  // Connecting to the database
  mongoose
    .connect(URI_DB, {})
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};

export default connectDatabase;
