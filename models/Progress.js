// models/Progress.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
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
    age: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

progressSchema.index({ user_id: 1, date_recorded: 1 }, { unique: true });


// Check if the model already exists to prevent OverwriteModelError
const Progress = mongoose.models.Progress || mongoose.model('Progress', progressSchema);

module.exports = Progress;