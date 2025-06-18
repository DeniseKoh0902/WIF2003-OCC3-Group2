// routes/workoutRoutes.js
const express = require('express');
const router = express.Router();
const Workout = require('../models/WorkoutDays'); // Import the new Workout model

const authMiddleware = require('../middleware/authMiddleware');


// GET all workout dates for a specific month and year for the current user
router.get('/month/:year/:month', authMiddleware, async (req, res) => {
    
    const userId = String(req.user.id);

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month); // 0-indexed month from frontend (0 for Jan, 11 for Dec)

    if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
        return res.status(400).json({ message: 'Invalid year or month provided.' });
    }

    // Calculate start and end of the month
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // Last day of the month

    try {
        const workouts = await Workout.find({
            user_id: userId,
            date: { $gte: startDate, $lte: endDate }
        }).select('date -_id'); // Select only the 'date' field, exclude '_id'

        // Extract just the day numbers (1-31)
        const workoutDays = workouts.map(workout => workout.date.getDate());
        res.json(workoutDays);

    } catch (error) {
        console.error('Error fetching workouts for month:', error);
        res.status(500).json({ message: 'Server error fetching workouts.' });
    }
});

// POST a new workout date
router.post('/', authMiddleware, async (req, res) => {

    const userId = String(req.user.id);

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    const { date } = req.body; // Expecting a date string (e.g., "YYYY-MM-DD")

    if (!date) {
        return res.status(400).json({ message: 'Date is required for workout entry.' });
    }

    try {
        // Normalize date to start of day to ensure consistent uniqueness and querying
        const workoutDate = new Date(date);
        workoutDate.setHours(0, 0, 0, 0); // Set to start of the day UTC

        const newWorkout = new Workout({
            user_id: userId,
            date: workoutDate
        });

        await newWorkout.save();
        res.status(201).json(newWorkout); // Send back the saved workout record

    } catch (error) {
        console.error('Error saving workout:', error);
        if (error.code === 11000) { // Duplicate key error
            return res.status(409).json({ message: 'A workout entry for this date already exists.' });
        }
        res.status(500).json({ message: 'Server error saving workout.' });
    }
});

// DELETE a workout date
router.delete('/:date', authMiddleware, async (req, res) => {
    
    const userId = String(req.user.id);

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    const dateString = req.params.date; // Expecting date in YYYY-MM-DD format
    try {
        // Normalize date to start of day for deletion query
        const deleteDate = new Date(dateString);
        deleteDate.setHours(0, 0, 0, 0); // Set to start of the day UTC

        const result = await Workout.deleteOne({
            user_id: userId,
            date: deleteDate
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Workout entry not found for this date.' });
        }
        res.status(200).json({ message: 'Workout entry deleted successfully.' });

    } catch (error) {
        console.error('Error deleting workout:', error);
        res.status(500).json({ message: 'Server error deleting workout.' });
    }
});

module.exports = router;