const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    actorId: { type: String, required: true },
    sessionId: { type: String, required: true }, 
    actorName: { type: String, required: true },
    action: { type: String, required: true }, 
    targetId: { type: String, required: false },
    targetType: { type: String, required: false },
    target: { type: String, required: false },
    changes: { type: Object, required: false, default: {} }, 
  },
  { timestamps: true }
);

AuditLogSchema.index({ sessionId: 1, action: 1 });

module.exports = mongoose.model("AuditLog", AuditLogSchema);
