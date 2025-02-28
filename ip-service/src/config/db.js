const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());

const apiRouter = express.Router();
app.use("/ip-api", apiRouter);

apiRouter.get("/test", async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      throw new Error("MongoDB not connected");
    }
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.send({ message: "✅ MongoDB Connected!", collections });
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    res.status(500).json({ error: "MongoDB Connection Failed", details: error.message });
  }
});

const ipRoutes = require("./routes/ipRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");

app.use("/ip-api/ips", ipRoutes);
app.use("/ip-api/audit-logs", auditLogRoutes);

app.listen(port, () => {
  console.log(`🚀 IP Service listening on port ${port}`);
});
