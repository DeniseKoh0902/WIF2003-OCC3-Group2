const express = require("express");
const router = express.Router();
const WorkoutPlan = require("../models/WorkoutPlan");

router.get("/:name", async (req, res) => {
  try {
    const searchName = req.params.name.trim();
    console.log(`Searching for: "${searchName}"`);

    // Try exact match first
    let plan = await WorkoutPlan.findOne({ plan_name: searchName });

    // If not found, try case-insensitive regex
    if (!plan) {
      plan = await WorkoutPlan.findOne({
        plan_name: { $regex: new RegExp(`^${searchName}$`, "i") },
      });
    }

    if (!plan) {
      const allPlans = await WorkoutPlan.find({}, "plan_name");
      console.log("Available plans:", allPlans);
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
        availablePlans: allPlans.map((p) => p.plan_name),
      });
    }

    res.json({
      success: true,
      data: {
        plan_id: plan._id,
        plan_name: plan.plan_name,
        plan_description: plan.plan_description,
        calories_burned: plan.calories_burned,
        steps: plan.steps.sort((a, b) => a.step_order - b.step_order),
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Get plan by MongoDB _id
router.get('/by-object-id/:objectId', async (req, res) => {
  try {
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
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
