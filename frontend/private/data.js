const userData = {
    username: 'win10',
    weight: 57, 
    height: 169,
    age: 21,
    bmi: 20.1
};

const weeklySummary = {
    activeTime: 1893, // minutes
    steps: 7657,
    averageCalories: 1896
};

const weightChangeData = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    actualWeight: [57.5, 58.2, 57.1, 58.5, 57.8, 56.5, 56.0],
    targetWeight: [57.0, 56.5, 56.0, 55.5, 55.0, 54.5, 54.0]
};

const stepCountData = {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    steps: [0, 4500, 9500, 5800, 0, 4500, 9500]
};

const activeTimeData = {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    minutes: [15, 20, 45, 70, 75, 70, 65]
};

const workoutDays = [
   2
]
// Create a global appData object
window.appData = {
    userData,
    weeklySummary,
    weightChangeData,
    stepCountData,
    activeTimeData,
    workoutDays,
    // reminders,
    activeNotifications : []
};
