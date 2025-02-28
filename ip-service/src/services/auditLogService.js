const AuditLog = require("../models/AuditLog");

async function logAction({ actorId, sessionId, actorName, action, targetId = null, targetType, target = null, changes = {}}) {
  try {
    await AuditLog.create([{ actorId, sessionId, actorName, action, targetId, targetType, target, changes}]);

    console.log("✔️ Log action recorded successfully");
  } catch (error) {
    console.error("❌ Failed to log action:", error);
  }
}

module.exports = { logAction };
