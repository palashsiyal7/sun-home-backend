const asyncHandler = require("express-async-handler");
const HomeEnvFormModel = require("../../models/NurseFormsModels/HomeEnvModel");
const formatDate = require("../../utils/formatDate");

// Helper function to convert date strings from dd/mm/yyyy to Date objects
const convertToDateObject = (dateString) => {
  const parts = dateString.split("/");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JS months are 0-based
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
};

// Function to recursively convert all date strings in an object
const convertAllDates = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      // Recurse into sub-objects
      convertAllDates(obj[key]);
    } else if (key === "dateInstructed" || key === "signatureDate") {
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
    const homeEnvFormInfo = new HomeEnvFormModel(formData);
    const createdhomeEnvFormInfo = await homeEnvFormInfo.save();
    res.status(200).json(createdhomeEnvFormInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Home environmental Infos
const getAllForms = asyncHandler(async (req, res) => {
  try {
    const homeEnvFormInfos = await HomeEnvFormModel.find({});
    res.status(200).json(homeEnvFormInfos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Home environmental Info by ID
const getFormById = asyncHandler(async (req, res) => {
  const homeEnvFormInfo = await HomeEnvFormModel.findById(req.params.id);
  if (homeEnvFormInfo) {
    res.status(200).json(homeEnvFormInfo);
  } else {
    res.status(404).json({ message: "Home environmental info not found" });
  }
});

// Update Home environmental Info
const updateForm = asyncHandler(async (req, res) => {
  try {
    const homeEnvInfo = await HomeEnvFormModel.findById(req.params.id);
    if (homeEnvInfo) {
      // Update the entire homeEnvInfo object with req.body
      Object.assign(homeEnvInfo, req.body);
      const updatedHomeEnvFormData = await homeEnvInfo.save();
      res.status(200).json(updatedHomeEnvFormData);
    } else {
      res.status(404).json({ message: "Home environmental info not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Home environmental Info
const deleteForm = asyncHandler(async (req, res) => {
  try {
    const homeEnvData = await HomeEnvFormModel.findById(req.params.id);
    if (homeEnvData) {
      // await homeEnvData.remove();
      await homeEnvData.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Home environmental info removed" });
    } else {
      res.status(404).json({ message: "Home environmental info not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Home environmental Info by assignmentId
const getFormByAssignmentId = asyncHandler(async (req, res) => {
  try {
    const homeEnvInfo = await HomeEnvFormModel.findOne({
      assignmentId: req.params.assignmentId,
    });

    if (homeEnvInfo) {
      res.status(200).json(homeEnvInfo);
    } else {
      res.status(404).json({
        message: "Home environmental info with given assignmentId not found",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Home environmental Info by assignmentId
const updateFormByAssignmentId = asyncHandler(async (req, res) => {
  try {
    const assignmentId = req.params.id;
    // console.log(
    //   "updateFormByAssignmentId-home-environmental-info-Controller api hit"
    // );
    // console.log(req.body);
    const homeEnvData = await HomeEnvFormModel.findOne({ assignmentId });
    if (!homeEnvData) {
      res.status(404);
      throw new Error("not form found on this assignment id");
    }
    // Make sure to use the $set operator to specify the fields to update
    const updatedhomeEnvFormInfo = await HomeEnvFormModel.findOneAndUpdate(
      { assignmentId }, // Filter by assignmentId
      req.body, // Use $set to update the document fields with req.body
      { new: true } // Return the updated document and run validators
    );
    res.status(200).json(updatedhomeEnvFormInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Home environmental Info by assignmentId
const deleteFormByAssignmentId = asyncHandler(async (req, res) => {
  // console.log('hitt');
  try {
    const homeEnvInfo = await HomeEnvFormModel.findOne({
      assignmentId: req.params.assignmentId,
    });

    if (homeEnvInfo) {
      await homeEnvInfo.deleteOne({
        assignmentId: req.params.assignmentId,
      });
      // await homeEnvFormInfo.remove();
      res
        .status(200)
        .json({
          message: "Home environmental info with given assignmentId removed",
        });
    } else {
      res.status(404).json({
        message: "Home environmental info with given assignmentId not found",
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
