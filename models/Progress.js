const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    date_recorded: {
        type: Date,
        default: Date.now,
        required: true
    },
    weight: {
        type: Number,
        required: true,
        min: 0 
    },
    height: {
        type: Number,
        required: true,
        min: 0 
    },
    age: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true 
});

progressSchema.index({ user_id: 1, date_recorded: 1 }, { unique: true });

const Progress = mongoose.models.Progress || mongoose.model('Progress', progressSchema);

module.exports = Progress;