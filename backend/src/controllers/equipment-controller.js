import Equipment from "../models/equipment-model.js";
import { validationResult } from "express-validator";
const equipmentCltr = {};

equipmentCltr.getAllEquipments = async (req, res) => {
  try {
    const equipment = await Equipment.find();
    return res.json(equipment);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

equipmentCltr.createEquipment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const equipment = new Equipment(req.body);
    await equipment.save();
    return res.status(201).json(equipment);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

equipmentCltr.updateEquipment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.json(equipment);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
export default equipmentCltr;
