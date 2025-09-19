import { ManufacturerModel } from "../models/Manufacturer.js";
import mongoose from "mongoose";

export const createManufacturers = async (req, res) => {
  try {
    const newManufacturer = await ManufacturerModel.create(req.body);
    res.status(201).json(newManufacturer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getManufacturers = async (req, res) => {
  try {
    const Manufacturers = await ManufacturerModel.find();
    res.json(Manufacturers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getManufacturer = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "ID must be valid ObjectID" });
  }
  try {
    const Manufacturers = await ManufacturerModel.findById(req.params.id);
    res.json(Manufacturers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateManufacturer = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "ID must be valid ObjectID" });
  }
  try {
    const Manufacturers = await ManufacturerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(Manufacturers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteManufacturer = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "ID must be valid ObjectID" });
  }
  try {
    const manufacturer = await ManufacturerModel.findByIdAndDelete(
      req.params.id
    );
    res.json(manufacturer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
