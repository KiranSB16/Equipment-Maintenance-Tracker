import Equipment from "../model/equipment-model.js";

const equipmentCltr = {}

equipmentCltr.getAllEquipments = async (req, res) => {
  try {
    const equipment = await Equipment.find()
    res.json(equipment)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

equipmentCltr.createEquipment = async (req, res) => {
  try {
    const equipment = new Equipment(req.body)
    await equipment.save()
    res.status(201).json(equipment)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}


equipmentCltr.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" })
    }
    res.json(equipment)
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
export default equipmentCltr