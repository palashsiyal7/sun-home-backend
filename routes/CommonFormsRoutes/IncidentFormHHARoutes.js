const express = require('express');
const router = express.Router();
const {
  createForm,
  getAllForms,
  getFormById,
  getFormByAssignmentId,
  updateFormById,
  deleteFormById
} = require('../../controllers/CommonFormsController/IncidentHHAController'); // Adjust the path according to your project structure

// Route to create a new PCA schedule
router.post('/', createForm);

// Route to get all PCA schedules
router.get('/', getAllForms);

router.get('/assignmentId/:id', getFormByAssignmentId);
// Route to get a single PCA schedule by ID
router.get('/:id', getFormById);


// Route to update a PCA schedule by ID
router.put('/:id', updateFormById);

// Route to delete a PCA schedule by ID
router.delete('/:id', deleteFormById);

/**
 * @swagger
 * /api/incident-hha:
 *   post:
 *     summary: Create a new incident schedule
 *     tags:
 *       - Incident HHA
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IncidentScheduleRequest'
 *     responses:
 *       201:
 *         description: Incident schedule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncidentSchedule'
 *       400:
 *         description: Invalid request body
 *
 *   get:
 *     summary: Get all incident schedules
 *     tags:
 *       - Incident HHA
 *     responses:
 *       200:
 *         description: List of incident schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IncidentSchedule'

 * /api/incident-hha/{id}:
 *   get:
 *     summary: Get incident schedule by ID
 *     tags:
 *       - Incident HHA
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Incident schedule ID
 *     responses:
 *       200:
 *         description: Incident schedule found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncidentSchedule'
 *       404:
 *         description: Incident schedule not found
 *
 *   put:
 *     summary: Update incident schedule by ID
 *     tags:
 *       - Incident HHA
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Incident schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IncidentScheduleUpdate'
 *     responses:
 *       200:
 *         description: Incident schedule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IncidentSchedule'
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Incident schedule not found
 *
 *   delete:
 *     summary: Delete incident schedule by ID
 *     tags:
 *       - Incident HHA
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Incident schedule ID
 *     responses:
 *       200:
 *         description: Incident schedule deleted successfully
 *       404:
 *         description: Incident schedule not found
 */

module.exports = router;
