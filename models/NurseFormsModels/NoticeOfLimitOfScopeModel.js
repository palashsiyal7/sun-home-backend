const mongoose = require("mongoose");

const noticeOfLimitOfScopeSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: [true, "assignment Id is requiered"],
  },
  patientSignature: {
    type: String,
    required: [true, "Patient signature is required"],
  },
  patientDate: {
    type: Date,
    required: [true, "Date of patient signature is required"],
  },
});

const noticeOfLimitOfScope = mongoose.model(
  "noticeOfLimitOfScope",
  noticeOfLimitOfScopeSchema
);

module.exports = noticeOfLimitOfScope;
