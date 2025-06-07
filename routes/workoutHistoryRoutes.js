// routes/workoutHistoryRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const WorkoutPlan = require("../models/WorkoutPlan"); // Add this import
const Workout = require("../models/ManualWorkout");

// Define the schema
const WorkoutHistorySchema = new mongoose.Schema({
  user_id: String,
  workout_id: { type: String, default: null },
  plan_id: { type: String, default: null },
  workout_date: Date,
  duration: Number,
  calories_burned: Number,
});

// Define the model
const WorkoutHistory = mongoose.model(
  "WorkoutHistory",
  WorkoutHistorySchema,
  "WorkoutHistory"
);


router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      workout_id,
      plan_id,
      workout_date,
      duration,
      calories_burned,
    } = req.body;
    console.log("Incoming workout history data:", req.body);

    // Save the workout history (example)
    const history = new WorkoutHistory({
      user_id,
      plan_id: plan_id || null,
      workout_id: workout_id || null,
      workout_date,
      duration,
      calories_burned,
    });

    await history.save();

    res.status(201).json({ success: true, message: "Workout history saved" });
  } catch (error) {
    console.error("Error saving workout history:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET route to retrieve workout history by user_id
// GET workout history by user_id
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const history = await WorkoutHistory.find({ user_id: userId }).sort({
      workout_date: -1,
    });
    res.json(history);
  } catch (err) {
    console.error("Error in workout history route:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST workout history
router.post("/", async (req, res) => {
  try {
    const history = new WorkoutHistory(req.body);
    await history.save();
    res.status(201).json({ success: true, message: "Workout history saved" });
  } catch (error) {
    console.error("Error saving workout history:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});



router.get("/:planId", async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ plan_id: req.params.planId });
    if (!plan) {
      return res.status(404).json({ success: false, error: "Plan not found" });
    }
    res.json({ success: true, ...plan.toObject() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:workoutId", async (req, res) => {
  try {
    const workout = await Workout.findOne({ workout_id: req.params.workoutId });
    if (!workout) {
      return res
        .status(404)
        .json({ success: false, error: "Workout not found" });
    }
    res.json({ success: true, ...workout.toObject() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/by-object-id/:objectId', async (req, res) => {
  try {
    // Find plan by MongoDB _id
    const plan = await WorkoutPlan.findById(req.params.objectId);
    
    if (!plan) {
      return res.status(404).json({ 
        success: false, 
        message: 'Plan not found'
      });
    }
    
    res.json({
      success: true,
      plan_name: plan.plan_name,
      plan_description: plan.plan_description,
      calories_burned: plan.calories_burned
      // Include any other fields you need
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

