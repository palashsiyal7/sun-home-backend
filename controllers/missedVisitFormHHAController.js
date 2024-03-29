const MissedVisitForm = require('../models/MissedVisitHHAModel');
const asyncHandler = require("express-async-handler");

const createForm = asyncHandler(async (req, res) => {
  try {
    const newForm = await MissedVisitForm.create(req.body);
    res.status(201).json(newForm);
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
    const updatedForm = await MissedVisitForm.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedForm);
  } catch (error) {
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

module.exports = {
  createForm,getAllForms,getFormById,updateFormById,deleteFormById
}