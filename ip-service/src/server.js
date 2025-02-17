const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const mongoURI = process.env.MONGO_URI || "mongodb://mongo:27017/ip_management";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(express.json());

const apiRouter = express.Router();

app.use("/ip-api", apiRouter);

apiRouter.get("/test", async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.send({ message: "MongoDB Connected!", collections });
  } catch (error) {
    res.status(500).json({ error: "MongoDB Connection Failed" });
  }
});

app.listen(port, () => {
  console.log(`🚀 IP Service listening on port ${port}`);
});
