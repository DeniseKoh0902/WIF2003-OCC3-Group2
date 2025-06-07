const express = require("express");
const router = express.Router();
const ManualWorkout = require("../models/ManualWorkout");

// GET all workouts or filtered by category
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category && category.toLowerCase() !== "all") {
      query = {
        workout_category: new RegExp(category, "i"), // Case-insensitive search
      };
    }

    const workouts = await ManualWorkout.find(query).sort({ workout_id: 1 });
    res.json(workouts);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// GET single workout by ID
router.get("/:id", async (req, res) => {
  try {
    const workout = await ManualWorkout.findOne({
      workout_id: parseInt(req.params.id),
    });

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    res.json(workout);
  } catch (error) {
    console.error("Error fetching workout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
