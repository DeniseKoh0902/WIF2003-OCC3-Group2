
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Progress = require('../models/Progress');
const DailyGoal = require('../models/dailyGoal.js');


const authMiddleware = require('../middleware/authMiddleware');

//GET weekly summary AND daily data for a user
router.get('/steps', authMiddleware, async (req, res) => {
    
    const userId = String(req.user.id);
    
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    try {
        const goals = await DailyGoal.findById(req.user.id)
            .select('-_id -updatedAt -__v')
            .lean();

        if (!goals) {
            return res.status(404).json({ 
            message: 'No goals found. Default goals will be created on first update.' 
            });
        }

        res.json(goals);
        } catch (err) {
        console.error('Error fetching daily goals:', err);
        res.status(500).json({ 
            error: 'Server error while fetching goals',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }

    // try {
    //     const today = new Date();
    //     today.setHours(0, 0, 0, 0); // Start of today
    //     const sevenDaysAgo = new Date(today);
    //     sevenDaysAgo.setDate(today.getDate() - 6); // Covers today and the 6 preceding days = 7 days total

    //     const progressData = await Progress.aggregate([
    //         {
    //             $match: {
    //                 user_id: new mongoose.Types.ObjectId(userId), // Cast to ObjectId
    //                 date_recorded: { $gte: sevenDaysAgo, $lte: today } // Filter for the last 7 days (inclusive)
    //             }
    //         },
    //         {
    //             $project: { // Project only necessary fields and format date
    //                 _id: 0,
    //                 date: { $dateToString: { format: "%Y-%m-%d", date: "$date_recorded" } },
    //                 active_time: "$active_time",
    //                 steps: "$steps",
    //                 calories: "$calories"
    //             }
    //         },
    //         {
    //             $sort: { date: 1 } // Sort by date for chronological order in the array
    //         },
    //         {
    //             $group: {
    //                 _id: null, // Group all results into a single document
    //                 totalActiveTime: { $sum: "$active_time" },
    //                 totalSteps: { $sum: "$steps" },
    //                 totalCalories: { $sum: "$calories" }, // Sum calories to calculate average later
    //                 count: { $sum: 1 }, // Count documents to calculate average
    //                 dailyData: { $push: "$$ROOT" } // Push each daily document into an array
    //             }
    //         },
    //         {
    //             $project: {
    //                 _id: 0,
    //                 summary: {
    //                     activeTime: "$totalActiveTime",
    //                     steps: "$totalSteps",
    //                     averageCalories: { 
    //                         $cond: { // Handle division by zero if no data
    //                             if: { $eq: ["$count", 0] },
    //                             then: 0,
    //                             else: { $divide: ["$totalCalories", "$count"] }
    //                         }
    //                     }
    //                 },
    //                 dailyData: { // Re-project dailyData to remove unnecessary fields from the pushed root
    //                     $map: {
    //                         input: "$dailyData",
    //                         as: "day",
    //                         in: {
    //                             date: "$$day.date",
    //                             active_time: "$$day.active_time",
    //                             steps: "$$day.steps",
    //                             calories: "$$day.calories"
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     ]);

    //     // If no data was found, aggregation will return an empty array or an array with a single default object
    //     if (progressData.length === 0) {
    //         return res.status(200).json({
    //             summary: { activeTime: 0, steps: 0, averageCalories: 0 },
    //             dailyData: []
    //         });
    //     }

    //     res.json(progressData[0]); // Return the single result document
    // } catch (error) {
    //     console.error('Error fetching weekly summary and daily data:', error);
    //     res.status(500).json({ message: 'Server error fetching progress data.' });
    // }
});

router.get('/latest', authMiddleware, async (req, res) => {

    const userId = String(req.user.id);

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    try {
        const latestProgress = await Progress.findOne({ user_id: userId })
                                            .sort({ date_recorded: -1 })
                                            .limit(1);

        if (!latestProgress) {
            return res.status(200).json({ 
                message: "No progress data found for this user.",
                weight: 0,
                height: 0,
                age: 0,
                bmi: 0
            });
        }
        res.json(latestProgress);
    } catch (error) {
        console.error('Error fetching latest progress:', error);
        res.status(500).json({ message: 'Server error fetching progress.' });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const userId = String(req.user.id);

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    const { weight, height, age, date_recorded } = req.body;

    if (!weight || !height) {
        return res.status(400).json({ message: 'Weight and height are required.' });
    }

    try {
        const recordDate = date_recorded ? new Date(date_recorded) : new Date();
        recordDate.setHours(0, 0, 0, 0);
        const updatedProgress = await Progress.findOneAndUpdate(
            { user_id: userId, date_recorded: recordDate },
            { 
                weight,
                height,
                age
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        
        res.status(201).json(updatedProgress); 
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({ message: 'Server error saving progress.' });
    }
});


module.exports = router;