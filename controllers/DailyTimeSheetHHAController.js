const asyncHandler = require('express-async-handler');
const DailyTimeSheet = require('../models/DailyTimeSheetHHAModel.js');

// Create a new time sheet
const createTimeSheet = asyncHandler(async (req, res) => {
  const timeSheet = new DailyTimeSheet(req.body);
  
  const createdTimeSheet = await timeSheet.save();
  res.status(201).json(createdTimeSheet);
});

// Get all time sheets
const getAllTimeSheets = asyncHandler(async (req, res) => {
  const timeSheets = await DailyTimeSheet.find({});
  res.status(200).json(timeSheets);
});

// Get a single time sheet by ID
const getTimeSheetById = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;
  const timeSheet = await DailyTimeSheet.findOne({assignmentId});

  if (!timeSheet) {
    res.status(404);
    throw new Error('Time sheet not found');
  }

  res.status(200).json(timeSheet);
});

// Update a time sheet by ID
const updateTimeSheet = asyncHandler(async (req, res) => {
  console.log('update hitt');
  try {
    const assignmentId = req.params.id;
    const timeSheet = await DailyTimeSheet.findOne({ assignmentId });

    if (!timeSheet) {
      res.status(404);
      throw new Error('Time sheet not found');
    }

    const updatedTimeSheet = await DailyTimeSheet.findOneAndUpdate({assignmentId}, req.body, { new: true });
    res.status(200).json(updatedTimeSheet);
  } catch (error) {
    // Handle the error appropriately
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Delete a time sheet by ID
const deleteTimeSheet = asyncHandler(async (req, res) => {
  const timeSheetId = req.params.id;
  const timeSheet = await DailyTimeSheet.findById(timeSheetId);

  if (!timeSheet) {
    res.status(404);
    throw new Error('Time sheet not found');
  }

  await DailyTimeSheet.deleteOne({ _id: timeSheetId });
  res.status(200).json({ message: 'Time sheet deleted successfully' });
});

module.exports = {
  createTimeSheet,
  getAllTimeSheets,
  getTimeSheetById,
  updateTimeSheet,
  deleteTimeSheet
};
