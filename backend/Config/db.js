const mongoose = require("mongoose");

// Replace `yourDatabaseName` with the name of your actual database
const uri = "mongodb+srv://akhilsanker12345:cAhbYPsvARR5fKVt@cluster1.jer1z0q.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster1";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));
