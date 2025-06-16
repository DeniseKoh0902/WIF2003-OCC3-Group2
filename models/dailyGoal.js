const mongoose = require('mongoose');

const dailyGoalSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  steps_goal: { type: Number, default: 10000 },
  total_steps: { type: Number, default: 0 },
  calories_burned_goal: { type: Number, default: 800 },  
  time_goal: { type: Number, default: 60 },             // minutes
  water_intake_goal: { type: Number, default: 2 },      // litres
  total_water_intake: { type: Number, default: 0 },     // litres
}, { timestamps: true });

module.exports = mongoose.models.DailyGoal || mongoose.model('DailyGoal', dailyGoalSchema, );