import { ProductModel } from "../models/Product.js";
import mongoose from "mongoose";

// Create a new user
export const createProducts = async (req, res) => {
  try {
    const newProduct = await ProductModel.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
export const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single product by ID
export const getProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "ID must be valid ObjectID" });
  }
  try {
    const products = await ProductModel.findById(req.params.id);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "ID must be valid ObjectID" });
  }
  try {
    const products = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "ID must be valid ObjectID" });
  }
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
