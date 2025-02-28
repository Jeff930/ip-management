const mongoose = require("mongoose");

const IPSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    label: { type: String, required: true },
    comment: { type: String, default: "" },
    addedByUserId: { type: String, required: true },
    addedByUserName: { type: String, required: true }, 
    addedByUserEmail: { type: String, required: true }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("IP", IPSchema);
