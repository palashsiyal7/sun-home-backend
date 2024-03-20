const asyncHandler = require("express-async-handler");
const HomeEnvFormModel = require("../../models/NurseFormsModels/HomeEnvModel");
const formatDate = require("../../utils/formatDate");

// Helper function to convert date strings from dd/mm/yyyy to Date objects
const convertToDateObject = (dateString) => {
  const parts = dateString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JS months are 0-based
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
};

// Function to recursively convert all date strings in an object
const convertAllDates = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recurse into sub-objects
      convertAllDates(obj[key]);
    } else if (key === 'dateInstructed' || key === 'signatureDate') {
      // Convert date strings to Date objects
      obj[key] = convertToDateObject(obj[key]);
    }
  }
};

const createForm = asyncHandler(async (req, res) => {
  try {
    // Deep copy req.body to avoid mutating the original request object
    const formData = JSON.parse(JSON.stringify(req.body));

    // Convert all date strings to Date objects
    convertAllDates(formData);

    const confidentialInfo = new HomeEnvFormModel(formData);
    const createdConfidentialInfo = await confidentialInfo.save();
    res.status(200).json(createdConfidentialInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get All Confidential Infos
const getAllForms = asyncHandler(async (req, res) => {
  try {
    const confidentialInfos = await HomeEnvFormModel.find({});
    res.status(200).json(confidentialInfos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Confidential Info by ID
const getFormById = asyncHandler(async (req, res) => {
  const confidentialInfo = await HomeEnvFormModel.findById(req.params.id);

  if (confidentialInfo) {
    res.status(200).json(confidentialInfo);
  } else {
    res.status(404).json({ message: "Confidential info not found" });
  }
});

// Update Confidential Info
const updateForm = asyncHandler(async (req, res) => {
  try {
    const confidentialInfo = await HomeEnvFormModel.findById(req.params.id);

    if (confidentialInfo) {
      confidentialInfo.patientSignature =
        req.body.patientSignature || confidentialInfo.patientSignature;
      confidentialInfo.patientName =
        req.body.patientName || confidentialInfo.patientName;
      confidentialInfo.patientDate =
        req.body.patientDate || confidentialInfo.patientDate;
      confidentialInfo.clinicianSignature =
        req.body.clinicianSignature || confidentialInfo.clinicianSignature;
      confidentialInfo.clinicianName =
        req.body.clinicianName || confidentialInfo.clinicianName;
      confidentialInfo.clinicianDate =
        req.body.clinicianDate || confidentialInfo.clinicianDate;

      const updatedConfidentialInfo = await confidentialInfo.save();
      res.status(200).json(updatedConfidentialInfo);
    } else {
      res.status(404).json({ message: "Confidential info not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Confidential Info
const deleteForm = asyncHandler(async (req, res) => {
  try {
    const confidentialInfo = await HomeEnvFormModel.findById(req.params.id);

    if (confidentialInfo) {
      // await confidentialInfo.remove();
      await confidentialInfo.deleteOne({ _id: req.params.id });

      res.status(200).json({ message: "Confidential info removed" });
    } else {
      res.status(404).json({ message: "Confidential info not found" });
    }
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Confidential Info by assignmentId
const getFormByAssignmentId = asyncHandler(async (req, res) => {
  try {
    const confidentialInfo = await HomeEnvFormModel.findOne({
      assignmentId: req.params.assignmentId,
    });

    if (confidentialInfo) {
      res.status(200).json(confidentialInfo);
    } else {
      res.status(404).json({
        message: "Confidential info with given assignmentId not found",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Confidential Info by assignmentId
const updateFormByAssignmentId = asyncHandler(async (req, res) => {
  try {
    const assignmentId = req.params.id;
    console.log(
      "updateFormByAssignmentId-confidential-info-Controller api hit"
    );
    console.log(req.body);

    const confidentialForm = await HomeEnvFormModel.findOne({ assignmentId });

    if (!confidentialForm) {
      res.status(404);
      throw new Error("not form found on this assignment id");
    }
    // Make sure to use the $set operator to specify the fields to update
    const updatedConfidentialInfo = await HomeEnvFormModel.findOneAndUpdate(
      { assignmentId }, // Filter by assignmentId
      req.body, // Use $set to update the document fields with req.body
      { new: true } // Return the updated document and run validators
    );
    res.status(200).json(updatedConfidentialInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Confidential Info by assignmentId
const deleteFormByAssignmentId = asyncHandler(async (req, res) => {
  try {
    const confidentialInfo = await HomeEnvFormModel.findOne({
      assignmentId: req.params.assignmentId,
    });

    if (confidentialInfo) {
      await confidentialInfo.deleteOne({
        assignmentId: req.params.assignmentId,
      });
      // await confidentialInfo.remove();
      res
        .status(200)
        .json({ message: "Confidential info with given assignmentId removed" });
    } else {
      res.status(404).json({
        message: "Confidential info with given assignmentId not found",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createForm,
  getAllForms,
  getFormByAssignmentId,
  updateFormByAssignmentId,
  deleteFormByAssignmentId,
  getFormById,
  updateForm,
  deleteForm,
};
