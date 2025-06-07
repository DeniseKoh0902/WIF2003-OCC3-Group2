const mongoose = require('mongoose');

const connectDB = async () => {
  const dbConnectionString = process.env.MONGODB_CONNECTION_STRING;
  if (!dbConnectionString) {
    console.error("MongoDB connection string is missing! Set the MONGODB_CONNECTION_STRING environment variable.");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbConnectionString);
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas:", err);
    process.exit(1);
  }
};

module.exports = connectDB;