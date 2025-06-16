// models/Workout.js
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assumes you have a User model for authentication
    },
    date: {
        type: Date,
        required: true,
        // Ensure only one workout entry per user per day for simplicity of highlighting
        // You might store this as just YYYY-MM-DD if you don't care about time
        // For accurate daily uniqueness, we'll store start of day.
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Create a unique index for user and date to prevent duplicate workout entries for the same day
// The `Date` object might have time components, so ensure it's start of day if strict daily unique needed.
// For now, it assumes exact date matching.
workoutSchema.index({ user_id: 1, date: 1 }, { unique: true });

const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);

module.exports = Workout;