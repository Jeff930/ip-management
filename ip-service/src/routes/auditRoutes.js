const express = require("express");
const AuditLog = require("../models/AuditLog");
const authenticateToken = require("../middlewares/authenticateToken");
const { logAction } = require("../services/auditLogService");

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
 * View logs (Requires `view-logs` permission)
 */
router.get("/", authenticateToken, checkPermission("view-logs"), async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error("❌ Failed to fetch logs:", error);
    res.status(500).json({ error: "Failed to fetch logs", details: error.message });
  }
});

router.post("/log-login", authenticateToken, async (req, res) => {
  const LoginUserId = req.user.sub;
  const LoginUserName = req.user.user_name;
  try {

    await logAction({
      actorId: LoginUserId,
      sessionId: req.user.session_id,
      actorName: LoginUserName,
      action: "LOGIN",
      targetId: LoginUserId,
      targetType: "USER",
      target: "SELF",
    });

    res.json({message: "success" });
  } catch (error) {
    console.error("❌ Failed to log login event:", error);
    res.status(500).json({ error: "Failed to log login event.", details: error.message });
  }
});

router.post("/log-logout", authenticateToken, async (req, res) => {
  const LogoutUserId = req.user.sub;
  const LogoutUserName = req.user.user_name;
  try {

    await logAction({
      actorId: LogoutUserId,
      sessionId: req.user.session_id,
      actorName: LogoutUserName,
      action: "LOGOUT",
      targetId: LogoutUserId,
      targetType: "USER",
      target: "SELF",
    });

    res.json({ message: "success" });
  } catch (error) {
    console.error("❌ Failed to log logout event:", error);
    res.status(500).json({ error: "Failed to log logout event:", details: error.message });
  }
});


module.exports = router;
