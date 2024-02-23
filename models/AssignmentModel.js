const mongoose = require("mongoose");
const Employee = require('../models/EmployeeModel');

const AssignmentSchema = new mongoose.Schema({

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true  
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