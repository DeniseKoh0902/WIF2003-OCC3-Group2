/**
 * Main JavaScript file for the CHARMSYNC app
 * Initializes all modules and handles main application logic
 */

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

//must wait for dom to load then initialize app
document.addEventListener("DOMContentLoaded", () => {
  console.log("CHARMSYNC app initialized");
  initializeApp();
  setupEventListeners();
  const throttledHandleGlobalResize = throttle(handleGlobalResize, 100); // Adjust limit as needed
  window.addEventListener("resize", throttledHandleGlobalResize);
});

//initialize app modules
function initializeApp() {
  console.log("Initializing app");
  // Update UI with user data
  updateUserInterface();

  // Initialize calendar with workout days
  // This now calls the exported function directly
  initializeCalendar();

  // Initialize charts with animations
  initializeCharts();

  // Initialize BMI display and calculator
  initializeBMI();

  // Initialize reminders system
  initializeReminders();
  console.log("initializeReminders() called");

  // Initialize notification system
  initializeNotifications();
  // Animate weekly cards on load
  animateWeeklyCards();
}

function formatTime(time24) {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // Convert 0 to 12
  return `${hour}:${minute} ${ampm}`;
}

//update UI with data
function updateUserInterface() {
  console.log("Updating user interface...");
  const { userData, weeklySummary, reminders } = appData;

  // Update weekly summary cards
  if (weeklySummary) {
    // Add checks in case data is missing
    document.querySelector(".active-time-card .card-value").textContent =
      weeklySummary.activeTime.toLocaleString();
    document.querySelector(".steps-card .card-value").textContent =
      weeklySummary.steps.toLocaleString();
    document.querySelector(".calories-card .card-value").textContent =
      weeklySummary.averageCalories.toLocaleString();
  } else {
    console.warn("weeklySummary data missing");
  }

  if (userData) {
    // Add checks
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

  // Render reminders
  const remindersList = document.querySelector(".reminders-list");
  remindersList.innerHTML = ""; // Clear previous reminders

  reminders
    .sort((a, b) => a.time.localeCompare(b.time))
    .forEach((reminder) => {
      const reminderItem = document.createElement("div");
      reminderItem.className = "reminder-item";
      reminderItem.dataset.id = reminder.id;

      reminderItem.innerHTML = `
            <div class="reminder-text">${reminder.text}</div>
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

  // Save new reminder
  document
    .getElementById("saveReminder")
    .addEventListener("click", saveNewReminder);

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
    // Add check
    // Use the imported saveAndCalculateBMI function
    saveBmiBtn.addEventListener("click", saveAndCalculateBMI);
  } else {
    console.warn("saveBmi button not found");
  }

  // Log out button
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    // Add check
    logoutBtn.addEventListener("click", function () {
      alert("Logout functionality would go here");
    });
  } else {
    console.warn("logout button not found");
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

function handleGlobalResize() {
  console.log(
    "Window throttled resize event. Re-initializing charts and BMI..."
  );
  // Re-initialize charts
  initializeCharts(); // This function in charts.js should handle resizing its own canvases
  // Re-initialize BMI chart
  initializeBMI(); // This function in bmi.js should handle resizing its own canvas
  // If you had other visual components that need redraw/recalc on resize, call them here
}
