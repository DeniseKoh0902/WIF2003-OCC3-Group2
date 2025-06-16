
const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
const authMiddleware = require("../middleware/authMiddleware");

const uri =
  process.env.MONGO_URI ||
  "mongodb+srv://admin:admin@progress.hgkftwq.mongodb.net/crud";
const dbName = "crud";

// Create a reusable MongoClient instance
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Adjust based on your needs
  serverSelectionTimeoutMS: 5000, // Timeout after 5s
});

// Connect to MongoDB when the server starts
let db;
(async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
})();

// Close connection on process termination
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

// Current user endpoint
router.get("/api/current-user", authMiddleware, async (req, res) => {
  try {
    res.json({
      _id: req.user.id,
      username: req.user.username,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get favorites endpoint
router.get("/api/favorites", authMiddleware, async (req, res) => {
  try {
    const favorites = await db.collection("NutritionHistory")
      .find({ user_id: req.user.id })
      .toArray();
    res.json(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

// Add favorite endpoint
router.post("/api/favorites", authMiddleware, async (req, res) => {
  try {
    const collection = db.collection("NutritionHistory");
    const { nutrition_id } = req.body;
    const user_id = req.user.id;

    // Check if already favorited
    const existingFavorite = await collection.findOne({ user_id, nutrition_id });
    if (existingFavorite) {
      return res.status(400).json({
        error: "This meal is already in your favorites",
        existingId: existingFavorite._id
      });
    }

    // Insert new favorite
    const result = await collection.insertOne({
      nutrition_id,
      user_id,
      intake_date: new Date()
    });

    res.status(201).json({
      message: "Favorite meal saved",
      _id: result.insertedId,
      nutrition_id,
      user_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving favorite meal" });
  }
});

// Delete specific favorite endpoint
router.delete("/api/favorites/:id", authMiddleware, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const result = await db.collection("NutritionHistory").deleteOne({
      _id: new ObjectId(req.params.id),
      user_id: req.user.id
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        message: "Favorite not found or not owned by user" 
      });
    }

    res.json({ 
      success: true,
      message: "Favorite deleted successfully",
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ 
      message: "Failed to delete favorite",
      error: error.message 
    });
  }
});

// Get all favorites for user
router.get("/api/favorites", authMiddleware, async (req, res) => {
  const user_id = req.user.id;

  try {
    await client.connect();
    const collection = client.db(dbName).collection("NutritionHistory");
    const favorites = await collection.find({ user_id }).toArray();
    res.json(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch favorites" });
  } finally {
    await client.close();
  }
});

// Delete all favorites endpoint
router.delete("/api/favorites", authMiddleware, async (req, res) => {
  try {
    const result = await db.collection("NutritionHistory")
      .deleteMany({ user_id: req.user.id });

    res.json({
      success: true,
      message: "All favorites deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Delete all error:", error);
    res.status(500).json({
      message: "Failed to delete all favorites",
      error: error.message
    });
  }
});

// Other endpoints (expired and all favorites) follow the same pattern...

module.exports = router;