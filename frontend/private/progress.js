import {
  initializeCalendar,
  navigateMonth,
  addWorkout,
  removeWorkout,
} from "./calendar.js";

import { initializeCharts } from "./charts.js"; 
import { initializeBMI, saveAndCalculateBMI } from "./bmi.js";
import { initializeReminders, saveNewReminder } from "./reminders.js";
import {initializeNotifications, toggleNotificationPanel} from './notifications.js';

let appData = {
    userData: null,
    weeklySummary: null, 
    dailyProgressData: [], // Stores daily data for step/active time charts
    dailyStepsData: [],
    monthlyWeightData: [], // NEW: Stores monthly data for weight chart
    reminders: []
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("CHARMSYNC app initialized");
  initializeApp();
  
  
  setupEventListeners();
  const throttledHandleGlobalResize = throttle(handleGlobalResize, 100); 
  window.addEventListener("resize", throttledHandleGlobalResize);
});

async function initializeApp() { 
  console.log("Initializing app");
  await initializeUserInfo();
  await fetchAndDisplayWeeklySummary(); 
  await fetchAndDisplayMonthlyWeightData(); // NEW: Fetch monthly weight data

  updateUserInterface(); 
  initializeCalendar();
  initializeCharts(appData.dailyProgressData, appData.dailyStepsData, appData.monthlyWeightData); 
  initializeBMI(); 
  initializeReminders();
  console.log("initializeReminders() called");
  initializeNotifications();
  animateWeeklyCards();
}

async function initializeUserInfo() {
    console.log("Fetching user data...");
    try {
      const res = await fetch("/api/profile", {
        method: "GET",
        credentials: "include"
      });

      if (!res.ok) throw new Error("Failed to fetch user data");
      
      const user = await res.json();
      appData.userData = user;
    } catch (error) {
      console.error('Error fetching user data:', error);
      appData.userData = null;
    }
}

async function fetchAndDisplayWeeklySummary() {
    console.log("Fetching weekly summary and daily progress data...");
    try {

      const userId = appData.userData._id;
      const workoutHistoryResponse = await fetch(`/api/workout-history/user/${userId}`);

      if (!workoutHistoryResponse.ok) {
        throw new Error(`HTTP error! status: ${workoutHistoryResponse.status}`);
      }

      let history = await workoutHistoryResponse.json();
      //sorting logic date
      history.sort((a, b) => new Date(a.workout_date) - new Date(b.workout_date));

      console.log("Raw workout history:", history)

      // Step response
      const stepResponse = await fetch('/api/progress/steps');
      if (!stepResponse.ok) {
        throw new Error(`HTTP error! status: ${stepResponse.status}`);
      }

      const stepsCount = await stepResponse.json();
      console.log("Steps Count:", stepsCount)

      // Calculation
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);
      
      // Filter workouts within the last 7 days
      const weeklyWorkouts = history.filter(entry => {
        const workoutDate = new Date(entry.workout_date);
        workoutDate.setHours(0, 0, 0, 0);
        return workoutDate >= sevenDaysAgo && workoutDate <= today;
      });

      console.log("Filtered weekly workouts:", weeklyWorkouts);

      // Sum total ccalories and duration
      const totalCalories = weeklyWorkouts.reduce((sum, entry) => sum + (entry.calories_burned || 0), 0);
      const totalDuration = weeklyWorkouts.reduce((sum, entry) => sum + (entry.duration || 0), 0);
      const totalDurationMinutes = Math.round(totalDuration / 60);

      appData.weeklySummary = weeklyWorkouts;
      appData.dailyProgressData = history;
      appData.dailyStepsData = stepsCount;

      document.querySelector(".active-time-card .card-value").textContent = 
          (totalDurationMinutes || 0).toLocaleString(); 
      document.querySelector(".steps-card .card-value").textContent = 
          (stepsCount.total_steps || 0).toLocaleString();
      document.querySelector(".calories-card .card-value").textContent = 
          (totalCalories || 0).toFixed(0).toLocaleString(); 
      
        // const response = await fetch('/api/progress/weekly-summary');
        // if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // // const { summary, dailyData } = await response.json();

        // // console.log("Weekly summary fetched:", summary);
        // // console.log("Daily progress data fetched:", dailyData);

        // // appData.weeklySummary = summary; 
        // // appData.dailyProgressData = dailyData; 

        // // document.querySelector(".active-time-card .card-value").textContent = 
        // //     (summary.activeTime || 0).toLocaleString(); 
        // // document.querySelector(".steps-card .card-value").textContent = 
        // //     (summary.steps || 0).toLocaleString();
        // // document.querySelector(".calories-card .card-value").textContent = 
        // //     (summary.averageCalories || 0).toFixed(0).toLocaleString(); 
        // const summary = await response.json();

        // appData.dailyProgressData = summary;

        // document.querySelector(".active-time-card .card-value").textContent = 
        //     (summary.total_time || 0).toLocaleString(); 
        // document.querySelector(".steps-card .card-value").textContent = 
        //     (summary.total_steps || 0).toLocaleString();
        // document.querySelector(".calories-card .card-value").textContent = 
        //     (summary.total_calories_burned || 0).toFixed(0).toLocaleString(); 
            
    } catch (error) {
        console.error('Error fetching weekly summary and daily data:', error);
        document.querySelector(".active-time-card .card-value").textContent = '0';
        document.querySelector(".steps-card .card-value").textContent = '0';
        document.querySelector(".calories-card .card-value").textContent = '0';
        appData.weeklySummary = { activeTime: 0, steps: 0, averageCalories: 0 };
        appData.dailyProgressData = [];
        appData.dailyStepsData = [];
    }
}

async function fetchAndDisplayMonthlyWeightData() {
    console.log("Fetching monthly weight data...");
    try {
        // The browser automatically sends the 'Authorization' cookie with the request
        const response = await fetch('/api/weight/monthly-weight'); 
        if (!response.ok) {
            if (response.status === 401) {
                console.error("Authentication required. Please log in.");
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Monthly weight data fetched:", data);
        appData.monthlyWeightData = data;
        // ... rest of your code ...
    } catch (error) {
        console.error('Error fetching monthly weight data:', error);
        appData.monthlyWeightData = [];
    }
}

function formatTime(time24) {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // Convert 0 to 12
  return `${hour}:${minute} ${ampm}`;
}

function updateUserInterface() {
  console.log("Updating user interface...");
  const { userData, reminders } = appData;

  if (userData) {
    document.getElementById('profileName').textContent = userData.username;
    document.getElementById('profilePic').src = userData.profile_pic || './images/profile/profile2.png';

    const weightEl = document.getElementById("weight-value");
    const heightEl = document.getElementById("height-value");
    const ageEl = document.getElementById("age-value");
    const bmiValEl = document.querySelector(".bmi-value");
    const usernameEl = document.querySelector(".username");

    if (weightEl) weightEl.textContent = userData.weight;
    else console.warn("weight-value element not found");
    if (heightEl) heightEl.textContent = userData.height;
    else console.warn("height-value element not found");
    if (ageEl) ageEl.textContent = userData.age;
    else console.warn("age-value element not found");
    if (bmiValEl) bmiValEl.textContent = userData.bmi;
    else console.warn("bmi-value element not found");
    if (usernameEl) usernameEl.textContent = `@${userData.username}`;
    else console.warn("username element not found");

    // pre fill form
    const bmiFormWeight = document.getElementById("weight");
    const bmiFormHeight = document.getElementById("height");
    const bmiFormAge = document.getElementById("age");
    if (bmiFormWeight) bmiFormWeight.value = userData.weight;
    if (bmiFormHeight) bmiFormHeight.value = userData.height;
    if (bmiFormAge) bmiFormAge.value = userData.age;
  } else {
    console.warn("userData missing");
  }

  const remindersList = document.querySelector(".reminders-list");
  remindersList.innerHTML = ""; // Clear previous reminders

  reminders
    .sort((a, b) => a.time.localeCompare(b.time))
    .forEach((reminder) => {
      const reminderItem = document.createElement("div");
      reminderItem.className = "reminder-item";
      reminderItem.dataset.id = reminder.id;

      reminderItem.innerHTML = `
            <div class="reminder-name">${reminder.name}</div>
            <div class="reminder-time">${formatTime(reminder.time)}</div>
        `;

      remindersList.appendChild(reminderItem);
    });
}

//event listeners
function setupEventListeners() {
  console.log("Setting up event listeners");

  // Add reminder button click
  const addReminderBtn = document.querySelector(".add-reminder");
  addReminderBtn.addEventListener("click", () => {
    document.querySelector(".add-reminder-form").classList.add("show");
  });

  // Cancel adding reminder
  document.getElementById("cancelReminder").addEventListener("click", () => {
    document.querySelector(".add-reminder-form").classList.remove("show");
  });

  // Edit BMI button click
  const editBmiBtn = document.querySelector(".edit-bmi");
  if (editBmiBtn) {
    // Add check
    editBmiBtn.addEventListener("click", function () {
      // prefill form
      if (window.appData && window.appData.userData) {
        const weightInput = document.getElementById("weight");
        const heightInput = document.getElementById("height");
        const ageInput = document.getElementById("age");
        if (weightInput) weightInput.value = window.appData.userData.weight;
        if (heightInput) heightInput.value = window.appData.userData.height;
        if (ageInput) ageInput.value = window.appData.userData.age;
      } else {
        console.warn(
          "appData.userData not available for pre-filling BMI form."
        );
      }

      // Show the form
      const bmiForm = document.querySelector(".bmi-form");
      if (bmiForm) bmiForm.classList.add("show");
      else console.warn("BMI form element not found");
    });
  } else {
    console.warn("edit-bmi button not found");
  }

  // Cancel BMI edit
  const cancelBmiBtn = document.getElementById("cancelBmi");
  if (cancelBmiBtn) {
    // Add check
    cancelBmiBtn.addEventListener("click", function () {
      const bmiForm = document.querySelector(".bmi-form");
      if (bmiForm) bmiForm.classList.remove("show");
      else console.warn("BMI form element not found");
    });
  } else {
    console.warn("cancelBmi button not found");
  }

  // Save BMI changes
  const saveBmiBtn = document.getElementById("saveBmi");
  if (saveBmiBtn) {
    saveBmiBtn.addEventListener("click", saveAndCalculateBMI);
  } else {
    console.warn("saveBmi button not found");
  }

}

//weekly cards animation
function animateWeeklyCards() {
  const cardIcons = document.querySelectorAll(".card-icon");

  cardIcons.forEach((icon, index) => {
    // Add a slight delay for each card to create a cascade effect
    icon.style.opacity = "0"; // Ensure they start hidden in CSS
    setTimeout(() => {
      icon.style.transition = "opacity 0.5s ease-in-out"; // Add transition for animation
      icon.style.opacity = "1";
    }, index * 150);
  });
}

// throttle for global resize
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function (...args) {
    const context = this;
    const now = Date.now();
    if (!lastRan) {
      func.apply(context, args);
      lastRan = now;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        lastRan = now; // Update lastRan when the function actually runs
        func.apply(context, args);
      }, limit - (now - lastRan));
    }
  };
}

// Update handleGlobalResize to re-initialize charts with the data from appData
function handleGlobalResize() {
    console.log("Window throttled resize event. Re-initializing charts and BMI...");
    initializeCharts(appData.dailyProgressData, appData.dailyStepsData, appData.monthlyWeightData); // Pass data from appData
    initializeBMI();
}

export { initializeApp };
