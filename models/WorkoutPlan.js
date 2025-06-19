const mongoose = require("mongoose");

const workoutStepSchema = new mongoose.Schema({
  step_id: Number,
  step_name: String,
  step_order: Number,
  step_duration: String,
});

const workoutPlanSchema = new mongoose.Schema({
  plan_id: Number,
  plan_name: { type: String, unique: true },
  plan_description: String,
  calories_burned: String,
  steps: [workoutStepSchema],
});

module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema, "WorkoutPlans");
