const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());

const apiRouter = express.Router();
app.use("/", apiRouter);

apiRouter.get("/test", async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.send({ message: "MongoDB Connected!", collections });
  } catch (error) {
    res.status(500).json({ error: "MongoDB Connection Failed" });
  }
});

const ipRoutes = require("./routes/ipRoutes");
const auditLogRoutes = require("./routes/auditRoutes");

app.use("/ip-addresses", ipRoutes);
app.use("/audit-logs", auditLogRoutes);

app.listen(port, () => {
  console.log(`🚀 IP Service listening on port ${port}`);
});
