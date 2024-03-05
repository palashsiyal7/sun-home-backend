const mongoose = require("mongoose");

const confidentialInfoSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: [true, "assignment Id is requiered"],
  },
  patientSignature: {
    type: String,
    required: [true, "Patient signature is required"],
  },
  patientName: {
    type: String,
    required: [true, "Patient name is required"],
  },
  patientDate: {
    type: Date,
    required: [true, "Date of patient signature is required"],
  },
  clinicianSignature: {
    type: String,
    required: [true, "Clinician signature is required"],
  },
  clinicianName: {
    type: String,
    required: [true, "Clinician name is required"],
  },
  clinicianDate: {
    type: Date,
    required: [true, "Date of clinician signature is required"],
  },
});

const ConfidentialInfo = mongoose.model(
  "ConfidentialInfo",
  confidentialInfoSchema
);

module.exports = ConfidentialInfo;
