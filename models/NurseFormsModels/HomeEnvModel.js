const mongoose = require("mongoose");

const homeEnvSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: [false, "assignment Id is requiered"],
  },
  workingTelephone1: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  ifNoSpecifyDocument1: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },
  electricalCordsOutlets2: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  ifNoSpecifyDocument2: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },
  smokeAlarms3: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  ifNoSpecifyDocument3: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },
  fireExtinguisher4: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  ifNoSpecifyDocument4: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },
  outsideExitsAccessible5: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  ifNoSpecifyDocument5: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },
  alternateExitsAccessible6: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  ifNoSpecifyDocument6: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },
  walkingPathwaysLevel7: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  ifNoSpecifyDocument7: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },
  stairsGoodRepair8: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  ifNoSpecifyDocument8: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },
  lightingAdequate9: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  ifNoSpecifyDocument9: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },
  temperatureVentilationAdequate10: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  ifNoSpecifyDocument10: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },
  medicationsPoisonousSubstances11: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  ifNoSpecifyDocument11: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },
  bathroomSafe12: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  ifNoSpecifyDocument12: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },
  kitchenSafe13: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  ifNoSpecifyDocument13: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },
  environmentSafeOxygenUse14: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  ifNoSpecifyDocument14: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },
  overallEnvironmentSanitary15: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  ifNoSpecifyDocument15: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },
  other16: {
    type: String,
    enum: ["YES", "NO", "N/A"],
  },
  other: {
    type: String,
  },
  ifNoSpecifyDocument16: {
    itemNumber: {
      type: String,
    },
    dateInstructed: {
      type: Date,
    },
    teachingMaterialsProvided: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
  },

  //   ifNoSpecifyDocument: [{
  //     itemNumber: {
  //       type: String
  //     },
  //     dateInstructed: {
  //       type: String // Or Date, if you prefer to enforce date formatting
  //     },
  //     teachingMaterialsProvided: {
  //       type: String
  //     },
  //     actionPlan: {
  //       type: String
  //     }
  //   }]

  raisedToilet: Boolean,
  infantRub: Boolean,
  plugCovers: Boolean,
  CabinetLatches: Boolean,
  tubSeat: Boolean,
  windowLocks: Boolean,
  lpeaseSyrup: Boolean,
  grabBar: Boolean,
  smokeAlarm: Boolean,
  Wheelchair: Boolean,
  seatBedCushion: Boolean,
  nonSkidSurface: Boolean,
  FirstAidKit: Boolean,
  Lifeline: Boolean,
  Other: Boolean,
  otherSpecify: String,
  emergencyPreparedness: Boolean,
  explain: String,
  isThisPatientReceivingSkilledService: Boolean,
  ifNoDoesPatientHaveSkilledNeeds:Boolean,
  ifYesDoesPatientGivePermission: Boolean,

  signature: String,
  signatureDate: Date


});

const HomeEnvFormModel = mongoose.model("HomeEnvFormModel", homeEnvSchema);

module.exports = HomeEnvFormModel;
