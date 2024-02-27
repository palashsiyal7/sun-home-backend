const asyncHandler = require("express-async-handler");
const Assignment = require("../models/AssignmentModel");
const Employee = require("../models/EmployeeModel");
const _ = require('lodash'); // Make sure lodash is imported
const { Long } = require("mongodb");
const PatientModel = require("../models/PatientModel");

// @desc Create new assignment
// @route POST /assignments
// @access Private
const createAssignment = async (req, res) => {
  try {
    // Get data from body
    const { patient, employee, timeSlot, assignmentDate, skillLevel } =
      req.body;

    // Validate
    if (!patient || !employee || !timeSlot || !skillLevel) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Make sure employee role matches
    const dbEmployee = await Employee.findById(employee);

    if (!dbEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (dbEmployee.role !== skillLevel) {
      return res
        .status(400)
        .json({ message: "Skill level must match employee" });
    }

    // Create assignment
    const assignment = await Assignment.create({
      patient,
      employee,
      timeSlot,
      assignmentDate,
      skillLevel,
    })

    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Update assignment by id
// @route PATCH /assignments/:id
// @access Private
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Select fields allowed to update
    const updates = ["patient", "employee", "skillLevel", "assignmentDate"];
    const allowedUpdates = _.pick(req.body, updates);
    console.log(req.body);
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure that model validations run on update
      }
    ).populate("patient", "patient_name dob address image code")
    .populate("employee", "name role phoneNumber email")
    .populate("timeSlot", "timeSlot_name");

    res.json(updatedAssignment);
      console.log(updateAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc     Get All Assignments
// @route    GET /api/assignments
// @access   Private
const getAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find()
    .populate("patient", "patient_name dob address image code")
    .populate("employee", "name role phoneNumber email")
    .populate("timeSlot", "timeSlot_name");
  res.json(assignments);
});

// @desc     Get Assignment By ID
// @route    GET /api/assignments/:id
// @access   Private
const getAssignmentById = async (req, res) => {
  const assignment = await Assignment.findById(req.params.id)
    .populate("patient", "patient_name dob address image code")
    .populate("employee", "name role phoneNumber email")
    .populate("timeSlot", "timeSlot_name");

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  res.json(assignment);
};

// @desc     Delete Assignment
// @route    DELETE /api/assignments/:id
// @access   Private
const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findByIdAndDelete(req.params.id);

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  res.json(assignment);
});


// const getFilteredAssignments = asyncHandler(async (req, res) => {
//   try {
//     const { category, date } = req.query;
//     console.log('Received category and date in backend:', category, date);

//     // Convert category to uppercase if needed
//     const skillLevel = category ? category.toUpperCase() : null;

//     // Create a filter object based on provided parameters
//     const filters = {};
//     if (skillLevel) {
//       filters.skillLevel = skillLevel;
//     }
//     if (date) {
//       // Assuming date is provided in ISO format (e.g., "2024-02-20")
//       filters.assignmentDate = { $gte: new Date(date), $lt: new Date(date).setDate(new Date(date).getDate() + 1) };
//     }

//     const assignments = await Assignment.find(filters).populate('employee').populate('timeSlot');
//     res.json(assignments);
//   } catch (error) {
//     console.error('Error in getFilteredAssignments:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


// const getFilteredAssignments = asyncHandler(async (req, res) => {
//   try {
//     const { assignmentDate:category, assignmentDate:date } = req.params;
//     console.log('Received category and date in backend:', category, date);
//     // Convert category to uppercase if needed
//     const skillLevel = category ? category.toUpperCase() : null;
//     // Create a filter object based on provided parameters
//     const filters = {};
//     if (skillLevel) {
//       filters.skillLevel = skillLevel;
//     }
//     if (date) {
//       // Assuming date is provided in ISO format (e.g., "2024-02-20")
//       filters.assignmentDate = { $gte: new Date(date), $lt: new Date(date).setDate(new Date(date).getDate() + 1) };
//     }
//     const assignments = await Assignment.find(filters).populate('employee').populate('timeSlot');
//     if (assignments.length === 0) {
//       return res.status(404).json({ message: 'No assignments found matching the criteria' });
//     }
//     res.json(assignments);
//   } catch (error) {
//     console.error('Error in getFilteredAssignments:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


const getFilteredAssignments = asyncHandler(async (req, res) => {
  try {
    const { category, date } = req.query;
    // console.log('Received category and date in backend:', category, date);

    // Convert category to uppercase if needed
    const skillLevel = category ? category : null;

    // Create a filter object based on provided parameters
    const filters = {};
    if (skillLevel) {
      filters.skillLevel = skillLevel;
    }
    if (date) {
      // Assuming date is provided in ISO format (e.g., "2024-02-20")
      filters.assignmentDate = { $gte: new Date(date), $lt: new Date(date).setDate(new Date(date).getDate() + 1) };
    }

    const assignments = await Assignment.find(filters).populate('employee').populate('timeSlot').populate('patient' ,'patient_name');

    if (assignments.length === 0) {
      res.json(assignments);
      // return res.status(404).json({ message: 'No assignments found matching the criteria' });
    }

    res.json(assignments);
  } catch (error) {
    console.error('Error in getFilteredAssignments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const existingAssignments = async (req, res) => {
  try {
      const { employeeId, timeSlotId, assignmentDate } = req.query;
      
      // Query assignments based on provided parameters
      const assignments = await Assignment.find({
          employee: employeeId,
          timeSlot: timeSlotId,
          assignmentDate: assignmentDate
      });

      res.json(assignments);
  } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).json({ error: "Failed to fetch assignments." });
  }
}

const patientStatus = async (req, res) => {
  try {
    const { assignmentId, patientStatus } = req.body;

    // Update assignment status
    const assignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { patientStatus },
      { new: true } // Return the updated document
    ).populate('patient timeSlot');

    if (!assignment) {
      return res.status(404).json('Assignment not found');
    }

    // If status is accepted, return required info
    if (patientStatus === 'accepted') {
      const patientInfo = {
        patient_name: assignment.patient.patient_name, // Assuming 'name' exists in Patient model
        code: assignment.patient.code, // Assuming 'code' exists in Patient model
        image: assignment.patient.image, // Assuming 'image' exists in Patient model
        address: assignment.patient.address, // Assuming 'address' exists in Patient model
        time: assignment.timeSlot.timeSlot_name, // Assuming 'time' exists in TimeSlot model
        date: assignment.assignmentDate
      };
      return res.status(200).json(patientInfo);
    } else if (patientStatus === 'rejected') {
      // Handle rejected status
      return res.status(200).json('Employee not available');
    } else {
      return res.status(400).json('Invalid status');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
  }
}

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getFilteredAssignments,
  existingAssignments,
  patientStatus
};
