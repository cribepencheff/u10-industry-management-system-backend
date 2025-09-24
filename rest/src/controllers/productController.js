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
    if (error.code === 11000) {
      return res.status(409).json({ error: `A product with SKU ${sku} already exists.` });
    }

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
  } catch (error) {
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
  } catch (error) {
    console.error(`[products/${req.params.id}]`, error);
    res.status(500).json({ error: "Error fetching product" });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  const allowedFields = ["name", "sku", "description", "price", "category", "manufacturer", "amountInStock"];
  const validInputs = {};

  allowedFields.forEach(field => {
    if (field in req.body) validInputs[field] = req.body[field];
  });

  if (!Object.keys(validInputs).length) {
    return res.status(400).json({ error: `At least one of the following fields must be provided: ${allowedFields.join(", ")}` });
  }


  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Product ID must be valid ObjectID" });
  }

  if ("manufacturer" in validInputs && !mongoose.isValidObjectId(validInputs.manufacturer)) {
    return res.status(400).json({ error: "Manufacturer ID must be a valid ObjectID" });
  }

  if ("manufacturer" in validInputs) {
    const existingManufacturer = await ManufacturerModel.findById(validInputs.manufacturer);
    if (!existingManufacturer) return res.status(400).json({ error: "Manufacturer does not exist" });
  }

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      validInputs,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: `A product with SKU "${validInputs.sku}" already exists.` });
    }

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
  } catch (error) {
    console.error(`[products/${req.params.id}]`, error);
    return res.status(500).json({ error: "Failed to delete product" } );
  }
};

// Total value of all products in stock
export const totalStockValue = async (req, res) => {
  try {
    const result = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: { $multiply: ["$price", "$amountInStock"] }
          }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({ totalValue: 0 });
    }

    res.status(200).json({ totalValue: Number(result[0]?.totalValue.toFixed(2)) });

  } catch (error) {
    console.error("[products/total-stock-value]", error);
    res.status(500).json({ error: "Error calculating total value of products" });
  }
};

// Total value of products in stock by manufacturer
export const totalStockValueByManufacturer = async (req, res) => {
  try {
    const result = await ProductModel.aggregate([
      {
        $lookup: {
          from: "manufacturers",
          localField: "manufacturer",
          foreignField: "_id",
          as: "manufacturerData"
        }
      },
      {
        $unwind: "$manufacturerData"
      },
      {
        $group: {
          _id: "$manufacturerData.name",
          totalValue: {
            $sum: {
              $multiply: ["$price", "$amountInStock"]}
          }
        }
      },
      { $project: {
        _id: 0,
        manufacturer: "$_id",
        totalValue: 1
      }}

    ])

    if(result.length === 0) {
      return res.status(200).json([]);
    }

    const formattedResult = result.map(item => ({
      manufacturer: item.manufacturer,
      totalValue: Number(item.totalValue.toFixed(2))
    }));

    res.status(200).json(formattedResult);

  } catch (error) {
    console.error("[products/total-stock-value-by-manufacturer]", error);
    res.status(500).json({ error: "Error calculating total value by manufacturer" });
  }
};

// low stock products, fewer than 10 in stock
export const lowStockProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({ amountInStock: { $lt: 10 } })

    if (!products.length) return res.status(200).json([]);

    res.status(200).json(products);
  } catch (error) {
    console.error("[products/low-stock]", error);
    res.status(500).json({ error: "Error fetching low stock products" });
  }
};

// Get products with critical stock (less than 5 items), including manufacturer and contact details
export const criticalStockProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({ amountInStock: { $lt: 5 } })
      .select("name sku amountInStock manufacturer")
      .populate({
        path: "manufacturer",
        select: "name contact -_id",
        populate: {
          path: "contact",
          select: "name phone email -_id"
        }
      });

    if (!products.length) return res.status(200).json([]);

    res.status(200).json(products);
  } catch (error) {
    console.error("[products/critical-stock]", error);
    return res.status(500).json({ error: "Error fetching critical stock products" });
  }
}