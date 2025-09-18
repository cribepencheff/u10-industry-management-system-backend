import mongoose from "mongoose";
import { ProductModel } from "../models/Product.js";
import { ManufacturerModel } from "../models/Manufacturer.js";
import { ContactModel } from "../models/Contact.js";

// Create a new product
export const createProduct = async (req, res) => {
  const { name, sku, description, price, category, manufacturer,  amountInStock } = req.body;

  if (!name || !sku || !description || !price || !category || !manufacturer || !amountInStock) {
    return res.status(400).json({ error: `All fields are required ${Object.values( req.body ).join(", ")}` });
  }

  if (!mongoose.isValidObjectId(manufacturer)) {
    return res.status(400).json({ error: "Manufacturer ID must be a valid ObjectID" });
  }

  try {
    const existingManufacturer = await ManufacturerModel.findById(manufacturer);
    if (!existingManufacturer) {
      return res.status(400).json({ error: "Manufacturer does not exist" });
    }

    const existingProduct = await ProductModel.findOne({ sku });
    if (existingProduct) {
      return res.status(409).json({ error: `A product with SKU ${sku} already exists.` });
    }

    const newProduct = await ProductModel.create({
      name,
      sku,
      description,
      price,
      category,
      manufacturer,
      amountInStock
    });
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("[products/]", error);
    res.status(500).json({ error: "Error creating product" });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find()
      .populate({
        path: "manufacturer",
        select: "name",
        populate: {
          path: "contact",
          select: "name email"
        }
      }).lean();

    return res.status(200).json(products);
  } catch (err) {
    console.error("[products/]", error);
    return res.status(500).json({ error: "Error fetching products" });
  }
};

// Get a single product by ID
export const getProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "ID must be valid ObjectID" });
  }

  try {
    const product = await ProductModel.findById(req.params.id)
      .populate({
        path: "manufacturer",
        select: "name",
        populate: {
          path: "contact",
          select: "name email"
        }
      }).lean();

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(`[products/${req.params.id}]`, err);
    res.status(500).json({ error: err.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  const { name, sku, description, price, category, manufacturer,  amountInStock } = req.body;

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Product ID must be valid ObjectID" });
  }

  if (!mongoose.isValidObjectId(manufacturer)) {
    return res.status(400).json({ error: "Manufacturer ID must be a valid ObjectID" });
  }

  const existingProduct = await ProductModel.findById(req.params.id);
  if (!existingProduct) {
    return res.status(404).json({ error: "Product not found" });
  }

  const existingManufacturer = await ManufacturerModel.findById(manufacturer)
  if ( existingManufacturer === null) {
    return res.status(400).json({ error: "Manufacturer does not exist" });
  }

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error(`[products/${req.params.id}]`, error);
    return res.status(500).json({ error: "Failed to update product" });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Product ID must be valid ObjectID" });
  }

  const existingProduct = await ProductModel.findById(req.params.id);
  if (!existingProduct) {
    return res.status(404).json({ error: "Product not found" });
  }

  try {
    await ProductModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Product deleted successfully",
      product: existingProduct
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete product" } );
  }
};
