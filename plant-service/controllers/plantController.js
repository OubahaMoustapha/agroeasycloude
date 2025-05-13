const { Plant } = require('../models/plant');

const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plants', details: err.message });
  }
};

const getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plant', details: err.message });
  }
};

const createPlant = async (req, res) => {
  try {
    const requiredFields = ['titre', 'info_plantation', 'info_materiaux', 'info_arrosage', 'info_climat'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    const newPlant = new Plant({
      titre: req.body.titre,
      info_plantation: req.body.info_plantation,
      info_materiaux: req.body.info_materiaux,
      info_arrosage: req.body.info_arrosage,
      info_climat: req.body.info_climat
    });
    
    await newPlant.save();
    res.status(201).json(newPlant);
  } catch (err) {
    res.status(400).json({ 
      error: 'Failed to create plant',
      details: err.message 
    });
  }
};

const updatePlant = async (req, res) => {
  try {
    const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    });
    if (!updatedPlant) return res.status(404).json({ error: 'Plant not found' });
    res.json(updatedPlant);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update plant', details: err.message });
  }
};

const deletePlant = async (req, res) => {
  try {
    const deletedPlant = await Plant.findByIdAndDelete(req.params.id);
    if (!deletedPlant) return res.status(404).json({ error: 'Plant not found' });
    res.json({ message: 'Plant deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete plant', details: err.message });
  }
};

module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant
};