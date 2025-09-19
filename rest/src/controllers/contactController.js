import { ContactModel } from "../models/Contact.js";
import mongoose from "mongoose";

export const createContacts = async (req, res) => {
  try {
    const newContact = await ContactModel.create(req.body);
    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await ContactModel.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getContact = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "ID must be valid ObjectID" });
  }
  try {
    const contact = await ContactModel.findById(req.params.id);
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a Contact
export const updateContact = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "ID must be valid ObjectID" });
  }
  try {
    const contact = await ContactModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteContact = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "ID must be valid ObjectID" });
  }
  try {
    const contact = await ContactModel.findByIdAndDelete(req.params.id);
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
