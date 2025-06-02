import Charger from "../models/Charger.js";

const createCharger = async (req, res) => {
  try {
    const { name, location, status, powerOutput, connectorType } = req.body;
    const charger = await Charger.create({
      name,
      location,
      status,
      powerOutput,
      connectorType,
      createdBy: req.userId,
    });
    res.status(201).json(charger);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllChargers = async (req, res) => {
  try {
    const chargers = await Charger.find({ createdBy: req.userId });
    res.json(chargers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCharger = async (req, res) => {
  try {
    const { id } = req.params;
    const charger = await Charger.findOneAndUpdate(
      { _id: id, createdBy: req.userId },
      req.body,
      { new: true }
    );
    if (!charger) {
      return res.status(404).json({ message: "Charger not found" });
    }
    res.json(charger);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteCharger = async (req, res) => {
  try {
    const { id } = req.params;
    const charger = await Charger.findOneAndDelete({
      _id: id,
      createdBy: req.userId,
    });
    if (!charger) {
      return res.status(404).json({ message: "Charger not found" });
    }
    res.json({ message: "Charger deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createCharger, getAllChargers, updateCharger, deleteCharger };
