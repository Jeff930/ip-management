const express = require("express");
const IP = require("../models/IP");
const { logAction } = require("../services/auditLogService");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

/**
 * Middleware to check user permissions
 */
const checkPermission = (permission) => (req, res, next) => {
  if (!req.user.permissions.includes(permission)) {
    return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
  }
  next();
};

/**
 * Get all IPs (No permission check required)
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const ips = await IP.find().sort({ createdAt: -1 });
    res.json(ips);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch IPs" });
  }
});

/**
 * Add a new IP (Requires `create-ip` permission)
 */
router.post("/", authenticateToken, checkPermission("create-ip"), async (req, res) => {
  const { ip, comment, label } = req.body;
  const addedByUserId = req.user.sub;
  const addedByUserName = req.user.user_name;
  const addedByUserEmail = req.user.email;

  if (!ip || !label) {
    return res.status(400).json({ error: "IP address and label are required." });
  }

  try {
    const newIP = await IP.create({ ip, comment, label, addedByUserId, addedByUserName, addedByUserEmail });

    console.log("for logs", {
      userId: addedByUserId,
      sessionId: JSON.stringify(req.user.jti),
      action: "create",
      target: `IP: ${ip}`,
      changes: { ip, comment, label }
    })

    await logAction({
      actorId: addedByUserId,
      sessionId: req.user.jti,
      actorName: addedByUserName,
      action: "create",
      targetId: newIP._id,
      targetType: "IP Address",
      target: newIP.ip,
      changes: { ip, comment, label }
    });

    res.status(201).json(newIP);
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: "Validation error", details: validationErrors });
    }

    if (error.name === "MongoServerError") {
      return res.status(500).json({ error: "Database error: " + error.message });
    }

    console.error("Error adding IP:", error);
    res.status(500).json({ error: "An unexpected error occurred while adding IP" });
  }
});


/**
 * Update an IP (Requires `edit-any-ip` permission)
 */
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { ip, comment, label } = req.body;
  const updatedByUserId = req.user.sub;
  const updatedByUserName = req.user.user_name;
  const updatedByUserEmail = req.user.email;
  const hasEditAnyIpPermission = req.user.permissions.includes("edit-any-ip");

  try {
    const existingIP = await IP.findById(id);
    if (!existingIP) {
      return res.status(404).json({ error: "IP not found" });
    }

    let updateData = { label };

    if (hasEditAnyIpPermission || existingIP.addedByUserId.toString() === updatedByUserId) {
      updateData = { ip, comment, label, updatedByUserId, updatedByUserName, updatedByUserEmail };
    }

    const updatedIP = await IP.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
    await logAction({
      actorId: updatedByUserId,
      sessionId: req.user.jti,
      actorName: updatedByUserName,
      action: "update",
      targetId: id,
      targetType: "IP Address",
      target: existingIP.ip,
      changes: { ip, comment, label }
    });

    res.json(updatedIP);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "This IP address already exists." });
    }
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: "Validation error", details: validationErrors });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid IP ID format." });
    }

    console.error("Error updating IP:", error);
    res.status(500).json({ error: "An unexpected error occurred while updating IP" });
  }
});

/**
 * Delete an IP (Requires `delete-ip` permission)
 */
router.delete("/:id", authenticateToken, checkPermission("delete-ip"), async (req, res) => {
  const { id } = req.params;
  const deletedByUserId = req.user.sub;
  const deletedByUserName = req.user.user_name;

  try {
    const deletedIP = await IP.findByIdAndDelete(id);
    if (!deletedIP) {
      return res.status(404).json({ error: "IP not found" });
    }

    await logAction({
      actorId: deletedByUserId,
      sessionId: req.user.jti,
      actorName: deletedByUserName,
      action: "delete",
      targetId: id,
      targetType: "IP Address",
      target: deletedIP.ip
    });

    res.json({ message: "IP deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete IP" });
  }
});

module.exports = router;
