// models/Progress.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    // User ID is crucial for tying progress to a specific user
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model for authentication
    },
    date_recorded: {
        type: Date,
        default: Date.now,
        required: true
    },
    weight: {
        type: Number,
        required: true,
        min: 0 // Weight cannot be negative
    },
    height: {
        type: Number,
        required: true,
        min: 0 // Height cannot be negative
    },
    steps: {
        type: Number,
        default: 0,
        min: 0
    },
    calories: {
        type: Number,
        default: 0,
        min: 0
    },
    active_time: { // In minutes
        type: Number,
        default: 0,
        min: 0
    },
    age: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Create a compound unique index to prevent duplicate entries for the same user on the same day
// This assumes 'date_recorded' will be stored as just the date (YYYY-MM-DD) or you'll query by date part
// For simplicity, we'll rely on `Date.now` for default and let it be unique per timestamp for now.
// If you want daily uniqueness, you'd need to manipulate `date_recorded` to be start-of-day.
progressSchema.index({ user_id: 1, date_recorded: 1 }, { unique: true });


// Check if the model already exists to prevent OverwriteModelError
const Progress = mongoose.models.Progress || mongoose.model('Progress', progressSchema);

module.exports = Progress;