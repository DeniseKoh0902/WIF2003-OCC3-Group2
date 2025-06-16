// models/DailyProgress.js
const mongoose = require('mongoose');

// Define the schema for daily progress records.
// This model will store historical daily data points for each user,
// allowing for trend analysis and chart visualization.
const dailyProgressSchema = new mongoose.Schema({
    // Reference to the User model. This links each daily record to a specific user.
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Assuming you have a 'User' model (e.g., from user.js or similar)
        required: true 
    },
    // The date for which this daily progress is recorded.
    // Storing it at the start of the day (00:00:00Z) simplifies daily aggregations.
    date: { 
        type: Date, 
        required: true, 
        index: true // Index for efficient date-based queries
    },
    // Daily step count. Default to 0 if not recorded.
    steps: { 
        type: Number, 
        default: 0 
    },
    // Daily active time in minutes. Default to 0.
    active_time: { 
        type: Number, 
        default: 0 
    },
    // Daily calories burned. Default to 0.
    calories_burned: { 
        type: Number, 
        default: 0 
    },
    // User's weight recorded on this specific day.
    // This is crucial for the historical weight chart.
    // Can be null if weight wasn't recorded for this day.
    weight: { 
        type: Number, 
        default: null 
    },
    // User's height recorded on this specific day.
    // Useful for historical BMI calculation if height changes over time.
    // Can be null if height wasn't explicitly recorded for this day.
    height: { 
        type: Number, 
        default: null 
    },
    // Calculated BMI for this day, based on the recorded weight and height.
    // Storing it pre-calculated makes retrieval faster for BMI trends.
    bmi: { 
        type: Number, 
        default: null 
    }
}, { 
    // Mongoose timestamps automatically add `createdAt` and `updatedAt` fields.
    timestamps: true 
});

// Create a compound unique index on user_id and date.
// This ensures that a user can only have one daily progress record per day,
// and significantly improves performance for queries filtering by user and date.
dailyProgressSchema.index({ user_id: 1, date: 1 }, { unique: true });

// Export the DailyProgress model.
// Use `mongoose.models.DailyProgress` to prevent recompilation if the model already exists.
module.exports = mongoose.models.DailyProgress || mongoose.model('DailyProgress', dailyProgressSchema);
