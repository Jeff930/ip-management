const express = require("express");
const AuditLog = require("../models/AuditLog");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

const checkPermission = (permission) => (req, res, next) => {
  if (!req.user || !Array.isArray(req.user.role.permissions)) {
    return res.status(403).json({ error: "Forbidden: No permissions found for the user" });
  }

  const hasPermission = req.user.role.permissions.some(p => p.name === permission);
  
  if (!hasPermission) {
    return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
  }

  next();
};

router.get("/", authenticateToken, checkPermission("view-logs"), async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error("❌ Failed to fetch logs:", error);
    res.status(500).json({ error: "Failed to fetch logs", details: error.message });
  }
});

module.exports = router;
