const asyncHandler = require('express-async-handler');
const DailyTimeSheet = require('../../models/CommonFormsModels/DailyTimeSheetHHAModel.js');
const formatDate = require('../../utils/formatDate.js');

const createTimeSheet = asyncHandler(async (req, res) => {
  try {
    console.log("first");

    // Function to convert time format from "2:59 PM" to "14:59"
    const convertTime12to24 = (time12h) => {
      const [time, modifier] = time12h.split(' ');
      let [hours, minutes] = time.split(':');

      if (hours === '12') {
        hours = '00';
      }

      if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
      }

      return `${hours}:${minutes}`;
    };
    const formattedBody = { ...req.body };
    ['date'].forEach((field) => {
      if (formattedBody[field]) {
        formattedBody[field] = formatDate(formattedBody[field]);
      }
    });
    // Convert startTime and endTime from req.body
    const convertedStartTime = convertTime12to24(req.body.startTime);
    const convertedEndTime = convertTime12to24(req.body.endTime);

    // Create a new DailyTimeSheet with converted times
    const timeSheet = new DailyTimeSheet({
      // ...req.body,
      ...formattedBody,
      startTime: convertedStartTime,
      endTime: convertedEndTime,
    });

    const createdTimeSheet = await timeSheet.save();
    res.status(201).json(createdTimeSheet);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the time sheet.' });
    console.error('Error creating time sheet:', error);
  }
});

module.exports = { createTimeSheet };



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
// const updateTimeSheet = asyncHandler(async (req, res) => {
//   // console.log('update hitt');
//   try {
//     const assignmentId = req.params.id;
//     const timeSheet = await DailyTimeSheet.findOne({ assignmentId });

//     if (!timeSheet) {
//       res.status(404);
//       throw new Error('Time sheet not found');
//     }

//     const updatedTimeSheet = await DailyTimeSheet.findOneAndUpdate({assignmentId}, req.body, { new: true });
//     res.status(200).json(updatedTimeSheet);
//   } catch (error) {
//     // Handle the error appropriately
//     res.status(500).json({ error: error.message || 'Internal Server Error' });
//   }
// });

const updateTimeSheet = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;
  const timeSheet = await DailyTimeSheet.findOne({ assignmentId });

  if (!timeSheet) {
    res.status(404);
    throw new Error('Time sheet not found');
  }

  const updatedTimeSheet = await DailyTimeSheet.findOneAndUpdate({assignmentId}, req.body, { new: true });
  res.status(200).json(updatedTimeSheet);
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
