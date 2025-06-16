const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Progress = require('../models/Progress');

const DUMMY_USER_ID = "60c728ef950549001c9b6789"; 

function getUserId(req) {
    return DUMMY_USER_ID; 
}

router.get('/weekly-summary', async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6); 

        const progressData = await Progress.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(userId), 
                    date_recorded: { $gte: sevenDaysAgo, $lte: today } 
                }
            },
            {
                $project: { 
                    _id: 0,
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$date_recorded" } },
                    active_time: "$active_time",
                    steps: "$steps",
                    calories: "$calories"
                }
            },
            {
                $sort: { date: 1 }
            },
            {
                $group: {
                    _id: null,
                    totalActiveTime: { $sum: "$active_time" },
                    totalSteps: { $sum: "$steps" },
                    totalCalories: { $sum: "$calories" },
                    count: { $sum: 1 }, 
                    dailyData: { $push: "$$ROOT" } 
                }
            },
            {
                $project: {
                    _id: 0,
                    summary: {
                        activeTime: "$totalActiveTime",
                        steps: "$totalSteps",
                        averageCalories: { 
                            $cond: { 
                                if: { $eq: ["$count", 0] },
                                then: 0,
                                else: { $divide: ["$totalCalories", "$count"] }
                            }
                        }
                    },
                    dailyData: { 
                        $map: {
                            input: "$dailyData",
                            as: "day",
                            in: {
                                date: "$$day.date",
                                active_time: "$$day.active_time",
                                steps: "$$day.steps",
                                calories: "$$day.calories"
                            }
                        }
                    }
                }
            }
        ]);

        if (progressData.length === 0) {
            return res.status(200).json({
                summary: { activeTime: 0, steps: 0, averageCalories: 0 },
                dailyData: []
            });
        }

        res.json(progressData[0]);
    } catch (error) {
        console.error('Error fetching weekly summary and daily data:', error);
        res.status(500).json({ message: 'Server error fetching progress data.' });
    }
});

router.get('/monthly-weight', async (req, res) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    try {
        const today = new Date();
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 5); 
        sixMonthsAgo.setDate(1); 
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const monthlyWeightData = await Progress.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(userId),
                    date_recorded: { $gte: sixMonthsAgo, $lte: today }
                }
            },
            {
                $group: {
                    _id: { 
                        year: { $year: "$date_recorded" },
                        month: { $month: "$date_recorded" }
                    },
                    avgWeight: { $avg: "$weight" },
                    avgHeight: { $avg: "$height" },
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } 
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id.month",
                    year: "$_id.year",
                    weight: "$avgWeight",
                    height: "$avgHeight"
                }
            }
        ]);

        if (monthlyWeightData.length === 0) {
            return res.status(200).json([]);
        }

        res.json(monthlyWeightData);
    } catch (error) {
        console.error('Error fetching monthly weight data:', error);
        res.status(500).json({ message: 'Server error fetching monthly weight data.' });
    }
});

router.get('/latest', async (req, res) => { /* ... */ });
router.post('/', async (req, res) => { /* ... */ });

module.exports = router;