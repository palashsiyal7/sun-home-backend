const express = require('express');
const router = express.Router();
const {createForm, getAllForms, getFormById, updateFormById, deleteFormById} = require('../controllers/missedVisitFormHHAController.js');

// POST route for creating a new missed visit form
router.post('/', createForm);

// GET route for retrieving all missed visit forms
router.get('/', getAllForms);

// GET route for retrieving a single missed visit form by ID
router.get('/:id', getFormById);

// PUT route for updating a missed visit form by ID
router.put('/:id', updateFormById);

// DELETE route for deleting a missed visit form by ID
router.delete('/:id', deleteFormById);

module.exports = router;
