const mongoose = require("mongoose");

const manualWorkoutSchema = new mongoose.Schema(
  {
    workout_id: Number,
    workout_name: { type: String, required: true },
    workout_description: String, // Changed from workout_excerptum
    workout_category: { type: String, required: true },
    calories_burned: { type: Number, required: true },
    workout_duration: String, // Changed from workout_equation
    workout_pic: { type: String, required: true },
    youtube: { type: String, required: true },
  },
  { collection: "ManualWorkout" }
); // Explicit collection name

module.exports = mongoose.model(
  "ManualWorkout",
  manualWorkoutSchema,
  "ManualWorkout"
);
