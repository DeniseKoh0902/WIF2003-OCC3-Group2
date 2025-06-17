const cron = require('node-cron');
const DailyGoal = require('../models/dailyGoal');

module.exports = function initializeDailyReset() {
  // Reset at midnight KL time
  cron.schedule(
    '0 0 * * *', 
    async () => {
      try {
        console.log('Starting daily progress reset for all users...');
        
        const result = await DailyGoal.updateMany(
          {}, 
          {
            $set: {
              total_steps: 0,
              total_water_intake: 0
            }
          }
        );

        console.log(`Successfully reset daily goals for ${result.nModified || result.modifiedCount} users`);
        
      } catch (err) {
        console.error('Failed to reset daily goals:', err);
      }
    },
    {
      timezone: 'Asia/Kuala_Lumpur',
      scheduled: true
    }
  );
};
