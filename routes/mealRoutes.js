const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");

// MongoDB connection URI (same as in your insert script or .env)
const uri =
  process.env.MONGO_URI ||
  "mongodb+srv://admin:admin@cluster0.hq7rg1u.mongodb.net/crud";
const client = new MongoClient(uri);
const dbName = "crud";

// Route to get all meals from MongoDB
router.get("/api/meals", async (req, res) => {
  try {
    await client.connect();
    const collection = client.db(dbName).collection("NutritionFood");
    const meals = await collection.find().toArray();
    res.json(meals);
  } catch (err) {
    console.error("Error fetching meals:", err);
    res.status(500).send("Failed to fetch meals");
  }
});


module.exports = router;
