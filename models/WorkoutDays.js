const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true
});

workoutSchema.index({ user_id: 1, date: 1 }, { unique: true });

const Workout = mongoose.models.Workout || mongoose.model('WorkoutDays', workoutSchema);

module.exports = Workout;