import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { ContactModel } from "../src/models/Contact.js";
import { ManufacturerModel } from "../src/models/Manufacturer.js";
import { ProductModel } from "../src/models/Product.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in .env");
if (!DB_NAME) throw new Error("Missing DB_NAME in .env");

const swedishPrefixes = ["070", "072", "073", "076", "079"];
const generateSwedishPhone = () => {
  const prefix = rand(swedishPrefixes);
  const number = faker.string.numeric({ length: 7 });
  return `${prefix}${number}`;
};

// Helper to pick a random item from array
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seedDatabase() {
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  console.log("Connected:", MONGODB_URI.split("@")[1]);

  // Reset database
  await Promise.all([
    ContactModel.deleteMany({}),
    ManufacturerModel.deleteMany({}),
    ProductModel.deleteMany({}),
  ]);

  // Create contacts
  const contacts = Array.from({ length: 5 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    phone: generateSwedishPhone(),
  }));
  const contactDocs = await ContactModel.insertMany(contacts, { ordered: false });

  // Create manufacturers
  const manufacturers = Array.from({ length: 3 }).map(() => ({
    name: faker.company.name(),
    country: faker.location.country(),
    website: faker.internet.url(),
    description: faker.company.catchPhrase(),
    adress: faker.location.streetAddress(),
    contact: rand(contactDocs)._id,
  }));
  const manufacturerDocs = await ManufacturerModel.insertMany(manufacturers, { ordered: false });

  // Create products
  const products = Array.from({ length: 10 }).map(() => ({
    name: faker.commerce.productName(),
    sku: faker.string.alphanumeric(8).toUpperCase(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    category: rand(["Electronics", "Furniture", "Clothing", "Food"]),
    manufacturer: rand(manufacturerDocs)._id,
    amountInStock: faker.string.numeric({ length: 2 }),
  }));
  await ProductModel.insertMany(products, { ordered: false });

  const totalContacts = await ContactModel.countDocuments();
  const totalManufacturers = await ManufacturerModel.countDocuments();
  const totalProducts = await ProductModel.countDocuments();

  console.log(
    `Seeding completed: ${totalContacts} contacts, ${totalManufacturers} manufacturers, ${totalProducts} products.`
  );

  await mongoose.disconnect();
}

seedDatabase().catch((e) => {
  console.error(e);
  process.exit(1);
});
