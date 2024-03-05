const MissedVisitForm = require('../../models/CommonFormsModels/MissedVisitHHAModel');
const asyncHandler = require("express-async-handler");

const createForm = asyncHandler(async (req, res) => {
  try {
    const newForm = await MissedVisitForm.create(req.body);
    res.status(200).json(newForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})

const getAllForms = asyncHandler(async (req, res) => {
  try {
    const forms = await MissedVisitForm.find().populate('patientId');
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getFormById = asyncHandler(async (req, res) => {
  try {
    const form = await MissedVisitForm.findById(req.params.id);
    if (!form) {
      // Use return here to stop the function if the form is not found
      return res.status(404).json({ message: 'Form not found' });
    }
    // If the form is found, send it and stop the function here
    return res.status(200).json(form);
  } catch (error) {
    // If an error occurs, send an error response and stop the function here
    return res.status(500).json({ message: error.message });
  }
});


const updateFormById = asyncHandler(async (req, res) => {
  try {
    console.log('controller hit', req.body);
    const assignmentId = req.params.id;

    // Find the document using assignmentId
    const formToUpdate = await MissedVisitForm.findOne({ assignmentId});

    if (!formToUpdate) {
      res.status(404);
      throw new Error('Form not found');
    }

    // Update the found document
    const updatedForm = await MissedVisitForm.findOneAndUpdate(
      {assignmentId}, 
      req.body,
      { new: true }
    );

    console.log(updatedForm);
    res.status(200).json(updatedForm);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});


const deleteFormById = asyncHandler(async (req, res) => {
  try {
    await MissedVisitForm.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Form successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getMissedFormDataByPatientId = asyncHandler(async (req, res) => {
  try {
    const assignmentId = req.params.id;  // Assuming the patientId is passed in the URL parameter
    const missed = await MissedVisitForm.findOne({ assignmentId });

    if (!missed) {
      return res.status(404).json({ message: 'missed not found' });
    }

    res.status(200).json(missed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  console.log("error")
});

module.exports = {
  createForm,getAllForms,getFormById,updateFormById,deleteFormById, getMissedFormDataByPatientId
}