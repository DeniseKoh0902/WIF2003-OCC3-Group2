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
    2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 21, 22, 24, 26, 28, 30
];

const reminders = [
    {
        id: 1,
        text: 'Drink water at 4:00 p.m',
        time: '16:00',
        notified: false
    },
    {
        id: 2,
        text: 'HIIT Cardio at 3:00 p.m',
        time: '15:00',
        notified: false
    },
    {
        id: 3,
        text: 'Remember to eat at 12:00 p.m',
        time: '12:00',
        notified: false
    },
    {
        id: 4,
        text: 'Drink water at 8:00 p.m',
        time: '20:00',
        notified: false
    }
];

// Create a global appData object
window.appData = {
    userData,
    weeklySummary,
    weightChangeData,
    stepCountData,
    activeTimeData,
    workoutDays,
    reminders,
    activeNotifications : []
};
