const mongoose = require("mongoose");

mongoose.set("strictQuery", true); // Configura strictQuery

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on("error", (error) => {
    console.log("MongoDB connection error:", error);
  });
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });
};

module.exports = connectDB;
