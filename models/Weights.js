const mongoose = require('mongoose');

const weightChangeSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assumes you have a 'User' model
    },
    year: {
        type: Number,
        required: true,
        min: 2000, 
        max: 2100  
    },
    month: {
        type: Number,
        required: true,
        min: 1,  // January
        max: 12  // December
    },
    latest_weight: {
        type: Number,
        required: true,
        min: 0 
    },
    latest_date_recorded: {
        type: Date,
        required: true
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt automatically by Mongoose
    collection: 'weightChange'
});

// Create a compound unique index to ensure only ONE document per user, year, and month.
weightChangeSchema.index({ user_id: 1, year: 1, month: 1 }, { unique: true });

const WeightChange = mongoose.models.WeightChange || mongoose.model('WeightChange', weightChangeSchema);

module.exports = WeightChange;
