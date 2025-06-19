
const mongoose = require('mongoose');

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
        type: String,
        required: true
    },
    notified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Reminder = mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
