// models/reminder.js
const mongoose = require('mongoose');

// Define the schema
const reminderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    time: {
        type: String, // Storing as HH:MM string
        required: true
    },
    notified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Check if the model already exists before compiling it
// This is the crucial part to prevent OverwriteModelError
const Reminder = mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;