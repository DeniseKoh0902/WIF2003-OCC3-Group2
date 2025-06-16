const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const WeightChange = require('../models/Weights'); 
const Progress = require('../models/Progress');    

const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, async (req, res) => {
    try {
        const userId = String(req.user.id);

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated. '});
        }

        const { weight, dateRecorded } = req.body;

        if (!weight) {
            return res.status(400).json({ message: 'Weight is required. '});
        }

        const recordDate = new Date(dateRecorded); // Ensure it's a Date object

        // 1. Insert into 'progress' collection (daily record)
        // const newProgressEntry = {
        //     user_id: userObjectId,
        //     date_recorded: recordDate,
        //     weight,
        //     height,
        //     steps,
        //     active_time,
        //     calories,
        // };

        // Use insertOne and handle potential unique index violation if needed
        // const progressResult = await Progress.create(newProgressEntry); // Using .create() for direct insertion
        // console.log('Backend: Daily progress added:', progressResult._id);

        // 2. Upsert into 'weightChange' collection (latest monthly weight)
        const year = recordDate.getFullYear();
        const month = recordDate.getMonth() + 1; // getMonth() is 0-indexed

        // Find existing document for the user, year, and month
        const existingWeightChange = await WeightChange.findOne({
            user_id: new mongoose.Types.ObjectId(userId),
            year: year,
            month: month
        });

        if (existingWeightChange) {
            if (recordDate > existingWeightChange.latest_date_recorded) {
                await WeightChange.updateOne(
                    { _id: existingWeightChange._id },
                    {
                        $set: {
                            latest_weight: weight,
                            latest_date_recorded: recordDate,
                            updatedAt: new Date() 
                        }
                    }
                );
                console.log(`Backend: Updated latest weight for ${year}-${month} to ${weight}kg.`);
            } else {
                console.log(`Backend: Skipping weight update for ${year}-${month}. New record is older or same as existing latest.`);
            }
        } else {
            // If no document exists for this month, insert a new one
            await WeightChange.create({
                user_id: new mongoose.Types.ObjectId(userId),
                year: year,
                month: month,
                latest_weight: weight,
                latest_date_recorded: recordDate
            });
            console.log(`Backend: Inserted new monthly weight for ${year}-${month}: ${weight}kg.`);
        }

        res.status(201).json({ 
            message: 'Monthly weight change processed successfully'
        });

    } catch (error) {
        console.error('Backend Error: Failed to add daily progress or update weight change:', error);
        if (error.code === 11000) { 
            return res.status(409).json({ error: 'Duplicate entry for this date. Progress already recorded for this user today.' });
        }
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Fetches monthly weight data for a specific user
router.get('/monthly-weight', authMiddleware, async (req, res) => {
    try {
        const userId = String(req.user.id);

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }
        
        let userObjectId;
        try {
            userObjectId = new mongoose.Types.ObjectId(userId);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid user ID format.' });
        }

        const monthlyWeightData = await WeightChange.find({ user_id: userObjectId })
            .sort({ year: 1, month: 1 }) 
            .select('year month latest_weight latest_date_recorded') 
            .lean(); 

        const formattedData = monthlyWeightData.map(doc => ({
            month: doc.month,
            year: doc.year,
            latest_weight: doc.latest_weight, 
            latest_date_recorded: doc.latest_date_recorded
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        console.error('Backend Error: Failed to fetch monthly weight data:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

router.get('/daily-progress', authMiddleware, async (req, res) => {
    try {
        const userId = String(req.user.id);

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        let userObjectId;
        try {
            userObjectId = new mongoose.Types.ObjectId(userId);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid user ID format.' });
        }

        const dailyProgressData = await Progress.find({ user_id: userObjectId })
            .sort({ date_recorded: 1 }) 
            .select('date_recorded steps active_time calories weight height') 
            .lean(); 

        res.status(200).json(dailyProgressData);
    } catch (error) {
        console.error('Backend Error: Failed to fetch daily progress data:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

module.exports = router;
