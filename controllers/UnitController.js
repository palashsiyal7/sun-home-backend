const asyncHandler = require("express-async-handler");
const Unit = require("../models/UnitModel");
const Program = require("../models/ProgramModel");

// Get all units
const getUnits = asyncHandler(async (req, res) => {
  const units = await Unit.find({}).populate("programs");
  res.status(200).json(units);
});

// Get unit by Id
const getUnitById = asyncHandler(async (req, res) => {
  const unitId = req.params.id;

  const unit = await Unit.findById(unitId).populate("programs");

  if (!unit) {
    res.status(404).json({ error: "Unit not found" });
  } else {
    res.status(200).json(unit);
  }
});

// Add new unit
const createUnit = asyncHandler(async (req, res) => {
  const { name, programIds } = req.body;
  if (!name) {
    res.status(400).json(`Unit name is required!`);
  }
  const existingUnit = await Unit.findOne({
    unit_name: name,
  });

  if (existingUnit) {
    res.status(400).json("Unit already exists!");
  } else {
    const unit = await Unit.create({
      unit_name: name,
      programs: programIds
    });

    res.status(201).json({
      message: `Unit created successfully`,
      unit: unit,
    });
  }
});

// Update unit_name
const updateUnitName = asyncHandler(async (req, res) => {
  const unitId = req.params.id;
  const { name } = req.body;

  try {
    // Find the unit by ID
    const unit = await Unit.findById(unitId);

    if (!unit) {
      res.status(404);
      throw new Error("Unit not found");
    }

    // Update unit_name
    unit.unit_name = name;
    await unit.save();

    res.status(200).json({
      message: `Unit name updated successfully`,
      unit: unit,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating unit name",
      error: error.message,
    });
  }
});

// Delete unit by ID
const deleteUnit = asyncHandler(async (req, res) => {
  const unitId = req.params.id;

  const unit = await Unit.findById(unitId);

  if (!unit) {
    res.status(404);
    throw new Error("Unit not found");
  }

  await Unit.deleteOne({ _id: unitId });

  res.status(200).json({
    message: `Unit deleted successfully`,
  });
});

// Add multiple programs to a location
const addProgramsToLocation = asyncHandler(async (req, res) => {
  const { unitId } = req.params;
  const { name, programIds } = req.body;

  const unit = await Unit.findById(unitId);
  const programs = await Program.find({ _id: { $in: programIds } });

  if (!unit || !programs) {
    res.status(404).json(`Unit or Programs not found`);
  }

  const existingUnit = await Unit.findOne({
    unit_name: name,
  });

  if (existingUnit && existingUnit._id.toString() !== unitId) {
    res.status(400).json(`Unit already exists!`);
  }

  const unitToUpdate = await Unit.findOneAndUpdate(
    {
      _id: unitId,
    },
    {
      unit_name: name,
      programs: programIds,
    }
  );

  await unitToUpdate.save();

  res.status(200).json({
    message: `Unit updated successfully`,
    unit: unit,
  });
});

module.exports = {
  getUnits,
  createUnit,
  deleteUnit,
  updateUnitName,
  getUnitById,
  addProgramsToLocation,
};
