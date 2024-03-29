const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Employee = require("../models/EmployeeModel");
const TimeSlotModel = require("../models/TimeSlotModel");
const AssignmentModel = require("../models/AssignmentModel");
const EmployeeModel = require("../models/EmployeeModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

// Get all employee
const getEmployees = asyncHandler(async (req, res) => {
  // const employees = await Employee.find({}, { password: 0 }).populate("timeSlots");
  const employees = await Employee.find({}).populate("timeSlots");
  // Exclude the password field from the response
  res.status(200).json(employees);
});

// Get employee by Id
const getEmployeeById = asyncHandler(async (req, res) => {
  const employeeId = req.params.id;

  // const employee = await Employee.findById(employeeId).select({ password: 0 }).populate("timeSlots");
  const employee = await Employee.findById(employeeId).populate("timeSlots");
  // Exclude the password field from the response
  if (!employee) {
    res.status(404).json({ error: "Employee not found" });
  } else {
    res.status(200).json(employee);
  }
});


// Add new employee
const createEmployee = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      password,
      evv,
      role,
      phoneNumber,
      email,
      address,
      relativeNameFirst,
      relativeContactFirst,
      relativeNameSecond,
      relativeContactSecond,
      availability,
      timeSlots,
    } = req.body;

    if (
      !name ||
      !evv ||
      !password ||
      !role ||
      !phoneNumber ||
      !email ||
      !address ||
      !relativeContactFirst ||
      !relativeNameFirst ||
      !availability ||
      !timeSlots
    ) {
      res.status(400).json({ message: "Required fields are missing" });
      return;
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingContactNo = await Employee.findOne({ phoneNumber });
    const existingEmail = await Employee.findOne({ email });

    if (existingContactNo) {
      res.status(422).json({
        message:
          "Contact Number already in use. Please enter a new number and try again",
      });
      return;
    } else if (existingEmail) {
      res.status(422).json({
        message: "Email already in use. Please enter a new email and try again",
      });
      return;
    }

    const employee = await Employee.create({
      name,
      password: hashedPassword,
      evv,
      role,
      phoneNumber,
      email,
      address,
      relativeNameFirst,
      relativeContactFirst,
      relativeNameSecond: relativeNameSecond || "NA",
      relativeContactSecond: relativeContactSecond || "NA",
      availability,
      timeSlots,
    });

    res.status(201).json({
      message: "Entry added successfully",
      employee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});






// Delete employee by ID
const deleteEmployee = asyncHandler(async (req, res) => {
  const employeeId = req.params.id;

  const employee = await Employee.findById(employeeId);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  await Employee.deleteOne({ _id: employeeId });

  res.status(200).json({
    message: `Employee deleted successfully`,
  });
});

// Update fields of employee
const updateEmployeeInfo = asyncHandler(async (req, res) => {
  try {
    const { employeeId } = req.params;
    const {
      name,
      password,
      evv,
      role,
      phoneNumber,
      email,
      address,
      relativeNameFirst,
      relativeContactFirst,
      relativeNameSecond,
      relativeContactSecond,
      availability,
      timeSlots,
    } = req.body;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      res.status(404);
      throw new Error("Employee not found");
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      employee.password = hashedPassword;
    }

    employee.employee_name = name;
    employee.evv = evv;
    employee.role = role;
    employee.phoneNumber = phoneNumber;
    employee.email = email;
    employee.address = address;
    employee.relativeNameFirst = relativeNameFirst;
    employee.relativeContactFirst = relativeContactFirst;
    employee.relativeNameSecond = relativeNameSecond ? relativeNameSecond : "NA";
    employee.relativeContactSecond = relativeContactSecond
      ? relativeContactSecond
      : "NA";
    employee.availability = availability;
    employee.timeSlots = timeSlots;
    await employee.save();

    res.status(200).json({
      message: `Employee data updated successfully`,
      employee: employee,
    });
  } catch (error) {
    // Handle the error appropriately
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// const getEmployeeByTimeSlot = async (req, res) => {
//   const { timeSlotId } = req.query; // Assuming time slot ID is passed as a query parameter

//   try {
//       const employee = await Employee.find({
//           'timeSlots._id': timeSlotId // Use the dot notation to query inside an array of subdocuments
//       });

//       if (employee.length === 0) {
//           return res.status(404).send({ message: 'No employee found for the specified time slot.' });
//       }

//       res.status(200).json(employee);
//   } catch (error) {
//       res.status(500).send({ message: 'Error fetching employee by time slot', error });
//   }
// };

const getEmployeeByTimeSlot = async (req, res) => {
  try {
    const timeSlotId = req.query.timeSlot;

    if (!timeSlotId) {
      return res.status(400).json({ message: "TimeSlot ID is required" });
    }

    const employee = await Employee.aggregate([
      {
        $lookup: {
          from: "timeslots", // Ensure this matches your time slots collection name
          localField: "timeSlots", // Assuming this is the correct field name in Employee schema
          foreignField: "_id", // Field in time slots collection to match on
          as: "timeSlotDetails",
        },
      },
      {
        $unwind: "$timeSlotDetails", // Unwind the array to filter each employee document
      },
      {
        $match: {
          "timeSlotDetails._id": new mongoose.Types.ObjectId(timeSlotId), // Correctly matching against ObjectId
        },
      },
    ]);

    res.json(employee);
  } catch (error) {
    res.status(500).send({
      message: "Error fetching employee by time slot",
      error: error.message,
    });
  }
};

// const getAvailableEmployees = async (req, res) => {
//   try {
//     const { date, timeSlotId, role } = req.query;

//     console.log(req.query);

//     // Find all employees with the specified role
//     let employees = await EmployeeModel.find({ role: role });

//     // Filter employees who are not assigned to any tasks at the given time slot on the specified date
//     const availableEmployees = [];
//     for (let emp of employees) {
//       const assignments = await AssignmentModel.find({
//         employee: emp._id,
//         timeSlot: timeSlotId,
//         assignmentDate: new Date(date), // Make sure to adjust date format if necessary
//       });

//       if (assignments.length === 0) {
//         // This employee is available
//         availableEmployees.push(emp);
//       }
//     }

//     res.json(availableEmployees);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error.message);
//   }
// };

const getAvailableEmployees = async (req, res) => {
  try {
    const { date, timeSlotId, role } = req.query;
    const dayOfWeek = new Date(date)
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();

    // Assuming your timeSlotId and role are correctly passed and exist
    let query = {
      role: role,
      availability: dayOfWeek, // Ensure employees are available on this day
      // You might need to adjust the availability check based on your data
    };

    // First, find employees who are potentially available based on role and availability
    let availableEmployees = await Employee.find(query);

    // Filter out employees who are already assigned to the given time slot on this date
    availableEmployees = availableEmployees.filter(async (emp) => {
      const assignments = await AssignmentModel.find({
        employee: emp._id,
        timeSlot: timeSlotId,
        assignmentDate: {
          $gte: new Date(date).setHours(0, 0, 0, 0),
          $lte: new Date(date).setHours(23, 59, 59, 999),
        },
      });
      return assignments.length === 0;
    });

    res.json(availableEmployees);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

const fetchEmployees = async (req, res) => {
  try {
    const { timeSlotId } = req.query;
    // Get all employees
    const employees = await EmployeeModel.find();
    // Get assignments for the selected time slot
    const assignments = await AssignmentModel.find({ timeSlot: timeSlotId });
    
    // Filter out the employees who are already assigned to the selected time slot
    const availableEmployees = employees.filter(employee => {
      return !assignments.some(assignment => assignment.employee.equals(employee._id));
    });

    res.json(availableEmployees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employees for the selected time slot." });
  }
}


// employee signin
const employeeSignin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    const passwordMatch = await bcrypt.compare(password, employee.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ email: employee.email, userId: employee._id }, 'your-secret-key', { expiresIn: '1h' });
    res.status(200).json({
      message: 'Success, Employee signed in successfully',
      token,
      employee: {
        id: employee._id,
        email: employee.email,
      },
    });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// reset password 
const resetEmployeePassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email exists in the Employee model
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Update the password for the employee
    employee.password = await bcrypt.hash(password, 10);

    // Save the updated employee
    await employee.save();

    // Return success message
    return res.status(200).json({
      message: 'Success, Employee password reset successfully',
      employee: {
        id: employee._id,
        email: employee.email,
      },
    });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = {
  getEmployees,
  createEmployee,
  getAvailableEmployees,
  fetchEmployees,
  deleteEmployee,
  getEmployeeById,
  updateEmployeeInfo,
  getEmployeeByTimeSlot,
  employeeSignin,
  resetEmployeePassword,
};
