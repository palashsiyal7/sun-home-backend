const mongoose = require("mongoose");
const Employee = require('./EmployeeModel');

const AssignmentSchema = new mongoose.Schema({

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true  
  },
  patientStatus: {
    type: String,
    default: 'pending',
    enum: ['pending', 'accepted', 'rejected']
  },

  employee: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee',
    required: true
  },

  timeSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimeSlot',
    required: true
  },

  assignmentDate: {
    type: Date, 
    default: Date.now
  },
   
  skillLevel: { 
    type: String,
    enum: ['Nurse', 'HHA'],
    required: true
  }  

}, {timestamps: true});


AssignmentSchema.pre('save', async function() {
  
  if(!this.employee) return;
  
  const employee = await Employee.findById(this.employee);  

  if(employee.role !== this.skillLevel) {
    throw new Error('Skill level must match employee'); 
  }

});

// AssignmentSchema.pre('save', async function(next) {
//   try {
//     // If no employee is assigned, skip the validation
//     if (!this.employee) return next();

//     const employee = await Employee.findById(this.employee);
//     if (!employee) {
//       throw new Error('Employee not found');
//     }

//     // Check if the employee's availability matches the assignment date
//     const assignmentDay = this.assignmentDate.getDay(); // Get the day of the week (0 for Sunday, 1 for Monday, ...)
//     const employeeAvailability = employee.availability.map(day => day.toLowerCase());
//     const isEmployeeAvailable = employeeAvailability.includes(getDayName(assignmentDay));
//     if (!isEmployeeAvailable) {
//       throw new Error('Employee is not available on the assignment date');
//     }

//     // Check if the employee's role matches the skill level required for the assignment
//     if (employee.role !== this.skillLevel) {
//       throw new Error('Skill level must match employee');
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// function getDayName(dayIndex) {
//   const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//   return days[dayIndex];
// }


AssignmentSchema.path('timeSlot').validate({
  validator: async function(value) {
    const count = await this.model('Assignment').countDocuments({
      employee: this.employee,
      timeSlot: value,
      assignmentDate: this.assignmentDate
     });
    return count === 0;
  }, 
  
  message: 'Timeslot already assigned to this employee'
});

AssignmentSchema.index({ 
  employee: 1,
  timeSlot: 1, 
  assignmentDate: 1, 
  skillLevel: 1  
});


module.exports = mongoose.model('Assignment', AssignmentSchema);