const app = require("./app");
require("dotenv").config();
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
