const mongoose = require("mongoose");

const WorkoutHistorySchema = new mongoose.Schema({
  user_id: String,
  workout_id: { type: String, default: null },
  plan_id: { type: String, default: null },
  workout_date: Date,
  duration: Number,
  calories_burned: Number,
});

module.exports = mongoose.model("WorkoutHistory", WorkoutHistorySchema);
