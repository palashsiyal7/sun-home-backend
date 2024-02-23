const asyncHandler = require('express-async-handler');
const Schedule = require('../models/ScheduleHHAModel');

// Create a new PCA schedule
const createSchedule = asyncHandler(async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    const createdSchedule = await schedule.save();
    res.status(201).json(createdSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all PCA schedules
const getAllSchedules = asyncHandler(async (req, res) => {
  try {
    const schedules = await Schedule.find({});
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single PCA schedule by ID
const getScheduleById = asyncHandler(async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a PCA schedule by ID
const updateSchedule = asyncHandler(async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const updatedSchedule = await Schedule.findByIdAndUpdate(scheduleId, req.body, { new: true });

    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a PCA schedule by ID
const deleteSchedule = asyncHandler(async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await Schedule.deleteOne({ _id: scheduleId });
    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule
};
