const express = require("express");
const router = express.Router();
const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  // getPersonnelByTimeSlot,
  getFilteredAssignments
} = require("../controllers/AssignController.js");

// POST /api/assignments
router.post("/", createAssignment);

// GET /api/assignments
router.get("/", getAssignments);

// GET filtered date and assignedToModel = /api/assignments
router.get("/category/", getFilteredAssignments);

// GET /api/assignments/:id
router.get("/:id", getAssignmentById);

// PUT /api/assignments/:id
router.put("/:id", updateAssignment);

// DELETE /api/assignments/:id
router.delete("/:id", deleteAssignment);

// router.get('/:role', getPersonnelByTimeSlot);

module.exports = router;

