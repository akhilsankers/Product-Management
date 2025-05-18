const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
mongoose.connect(
  "mongodb+srv://akhilsanker12345:cAhbYPsvARR5fKVt@cluster1.jer1z0q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));
