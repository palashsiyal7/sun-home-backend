const mongoose = require("mongoose");

const passportSupervisoryReportSchema = new mongoose.Schema({
  clientName: String,
  date: Date,
  primaryDiagnosis: String,

  adherenceToCarePlanExcellent: Boolean,
  adherenceToCarePlanAverage: Boolean,
  adherenceToCarePlanPoor: Boolean,
  adherenceToCarePlanGood: Boolean,
  adherenceToCarePlanComment: String,


  recordingReportingExcellent: Boolean,
  recordingReportingAverage: Boolean,
  recordingReportingPoor: Boolean,
  recordingReportingGood: Boolean,
  recordingReportingComment: String,


  problemsChangesExcellent: Boolean,
  problemsChangesAverage: Boolean,
  problemsChangesPoor: Boolean,
  problemsChangesGood: Boolean,
  problemsChangesComment: String,

  dressCodeExcellent: Boolean,
  dressCodeAverage: Boolean,
  dressCodePoor: Boolean,
  dressCodeGood: Boolean,
  dressCodeComment: String,

  promptnessExcellent: Boolean,
  promptnessAverage: Boolean,
  promptnessPoor: Boolean,
  promptnessGood: Boolean,
  promptnessComment: String,


  attendanceExcellent: Boolean,
  attendanceAverage: Boolean,
  attendancePoor: Boolean,
  attendanceGood: Boolean,
  attendanceComment: String,


  personalCareExcellent: Boolean,
  personalCareAverage: Boolean,
  personalCarePoor: Boolean,
  personalCareGood: Boolean,
  personalCareComment: String,


  qualityOfServiceExcellent: Boolean,
  qualityOfServiceAverage: Boolean,
  qualityOfServicePoor: Boolean,
  qualityOfServiceGood: Boolean,
  qualityOfServiceComment: String,

  medicalUnchanged: Boolean,
  medicalImproved: Boolean,
  medicalChanged: Boolean,
  medicalComment: String,

  mentalStatusUnchanged: Boolean,
  mentalStatusImproved: Boolean,
  mentalStatusChanged: Boolean,
  mentalStatusComment: String,

  mobilityUnchanged: Boolean,
  mobilityImproved: Boolean,
  mobilityChanged: Boolean,
  mobilityComment: String,

  nutritionUnchanged: Boolean,
  nutritionImproved: Boolean,
  nutritionChanged: Boolean,
  nutritionComment: String,

  skinUnchanged: Boolean,
  skinImproved: Boolean,
  skinChanged: Boolean,
  skinComment: String,

  nursingCarePlanReviewedWithClientCaregiver: String,

  serviceCarePlanReviewedWithClientCaregiver: String,

  hhaPresent: String,
  listTypeOfService:String,

  hhaHmName: String,
  hhaHmTitle: String,

  comments: String,
  clientSignature: String,
  supervisorSignature: String,
});

const PassportSupervisoryReport = mongoose.model(
  "PassportSupervisoryReport",
  passportSupervisoryReportSchema
);

module.exports = PassportSupervisoryReport;
