const express = require('express');
const router = express.Router();
const {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule
} = require('../controllers/ScheduleHHAController'); // Adjust the path according to your project structure

// Route to create a new PCA schedule
router.post('/', createSchedule);

// Route to get all PCA schedules
router.get('/', getAllSchedules);

// Route to get a single PCA schedule by ID
router.get('/:id', getScheduleById);

// Route to update a PCA schedule by ID
router.put('/:id', updateSchedule);

// Route to delete a PCA schedule by ID
router.delete('/:id', deleteSchedule);

module.exports = router;
