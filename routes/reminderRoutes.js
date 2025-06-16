const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Reminder = require('../models/Reminder');

const authMiddleware = require('../middleware/authMiddleware');

// GET all reminders for a user
router.get('/', authMiddleware, async (req, res) => {

    const userId = String(req.user.id);

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    try {
        const reminders = await Reminder.find({ user_id: new mongoose.Types.ObjectId(userId) })
                                        .sort({ time: 1, createdAt: 1 }); // Sort by time, then creation
        res.json(reminders);
    } catch (error) {
        console.error('Error fetching reminders:', error);
        res.status(500).json({ message: 'Server error fetching reminders.' });
    }
});

// POST a new reminder
router.post('/', authMiddleware, async (req, res) => {

    const userId = String(req.user.id);

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    const { name, time } = req.body; // reminder_notified defaults to false

    if (!name || !time) {
        return res.status(400).json({ message: 'All reminder fields are required.' });
    }

    try {
        const newReminder = new Reminder({
            user_id: new mongoose.Types.ObjectId(userId),
            name,
            time,
            notified: false // Always default to false for new reminders
        });
        await newReminder.save();
        res.status(201).json(newReminder);
    } catch (error) {
        console.error('Error adding reminder:', error);
        if (error.code === 11000) { // Duplicate key error
            return res.status(409).json({ message: 'Reminder ID already exists.' });
        }
        res.status(500).json({ message: 'Server error adding reminder.' });
    }
});

// PUT update reminder status (e.g., toggle notified)
router.put('/:id', authMiddleware, async (req, res) => {

    const userId = String(req.user.id);

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    const { id } = req.params;
    const { reminder_name, reminder_time, reminder_notified } = req.body;

    try {
        const updatedReminder = await Reminder.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(id), user_id: new mongoose.Types.ObjectId(userId) },
            { reminder_name, reminder_time, reminder_notified }, // Update fields
            { new: true, runValidators: true } // Return the updated document, run schema validators
        );

        if (!updatedReminder) {
            return res.status(404).json({ message: 'Reminder not found or unauthorized.' });
        }
        res.json(updatedReminder);
    } catch (error) {
        console.error('Error updating reminder:', error);
        res.status(500).json({ message: 'Server error updating reminder.' });
    }
});

// DELETE a reminder
router.delete('/:id', authMiddleware, async (req, res) => {

    const userId = String(req.user.id);

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    const { id } = req.params;

    try {
        const deletedReminder = await Reminder.findOneAndDelete({ 
            _id: new mongoose.Types.ObjectId(id), 
            user_id: new mongoose.Types.ObjectId(userId) 
        });

        if (!deletedReminder) {
            return res.status(404).json({ message: 'Reminder not found or unauthorized.' });
        }
        res.status(200).json({ message: 'Reminder deleted successfully.' });
    } catch (error) {
        console.error('Error deleting reminder:', error);
        res.status(500).json({ message: 'Server error deleting reminder.' });
    }
});

module.exports = router;