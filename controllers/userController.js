const User = require('../models/user');
const DailyGoal = require('../models/dailyGoal');
const WorkoutHistory = require('../models/WorkoutHistory');
const Progress = require('../models/Progress');
const Reminder = require('../models/Reminder');
const bcrypt = require('bcrypt');
const path = require('path');

// // GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -passwordHistory -resetPasswordToken -resetPasswordExpires').lean();
    const goals = await DailyGoal.findOne({ user_id: req.user.id }).lean();
    
    // Get workout stats
    const history = await WorkoutHistory.find({ user_id: req.user.id }).lean();
    const workoutStats = {
      totalWorkouts: history.length,
      achievementPoints: history.reduce((sum, workout) => sum + Math.floor((workout.duration || 0) / 60), 0)
    };

    // Format birthday for HTML date input
    if (user.birthday) {
      user.birthday = user.birthday.toISOString().split('T')[0];
    }

    res.json({ ...user, goals, workoutStats });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

// PUT /api/profile
exports.updateProfile = async (req, res) => {
  try {
    const { email, phonenumber, birthday } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { email, phonenumber, birthday: new Date(birthday) },
      { new: true, select: '-password -passwordHistory' }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// PUT /api/profile/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    // Check if new password is same as current
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) return res.status(400).json({ message: "New password must be different" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Server error changing password' });
  }
};

// POST /api/profile/upload-avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const avatarPath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profile_pic: avatarPath },
      { new: true, select: '-password -passwordHistory' }
    );

    res.json({ 
      message: 'Profile picture updated', 
      profile_pic: avatarPath 
    });
  } catch (err) {
    console.error('Error uploading avatar:', err);
    res.status(500).json({ error: 'Server error uploading avatar' });
  }
};


const moment = require('moment');

exports.getDailyStreak = async (req, res) => {
  try {
    const history = await WorkoutHistory.find({ 
      user_id: req.user.id,
      workout_date: { $exists: true, $ne: null }
    })
    .sort({ workout_date: -1 })
    .lean();

    const daysWithWorkouts = new Set();
    
    for (const entry of history) {
      const day = moment.utc(entry.workout_date).format('YYYY-MM-DD');
      daysWithWorkouts.add(day);
    }

    if (daysWithWorkouts.size === 0) {
      // No workouts at all
      return res.json({ streak: 0 });
    }

    // Get the most recent workout day (latest date)
    const mostRecentDayStr = [...daysWithWorkouts].sort().reverse()[0];
    let currentDate = moment.utc(mostRecentDayStr, 'YYYY-MM-DD');
    
    let streak = 0;
    while (daysWithWorkouts.has(currentDate.format('YYYY-MM-DD'))) {
      streak++;
      currentDate.subtract(1, 'day');
    }

    res.json({ streak });
  } catch (err) {
    console.error('Error calculating streak:', err);
    res.status(500).json({ error: 'Error calculating streak' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await Promise.all([
      WorkoutHistory.deleteMany({ user: userId }),
      DailyGoal.deleteMany({ user: userId }),
      Progress.deleteMany({ user: userId }),
      Reminder.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId)
    ]);

    res.status(200).json({ message: 'Account and all related data deleted.' });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ message: 'Failed to delete account.' });
  }
};
