/**
 * Reminders.js - Handles reminder creation, display, and management
 * Manages the reminders list and form functionality
 */
import {
  renderNotificationsList,
  updateNotificationBell,
} from "./notifications.js";

/**
 * @param {string} time24 - Time in 24-hour format (HH:MM)
 * @returns {string} Time in 12-hour format with AM/PM
 */
function formatTime(time24) {
  if (!time24) return ""; // Handle potential undefined/null
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;

  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

// Initialize reminders functionality
function initializeReminders() {
  console.log("initializeReminders() called");
  renderReminders();
  setInterval(checkReminders, 60000);
  checkReminders();
}

function renderReminders() {
  const remindersList = document.querySelector(".reminders-list");
  if (!remindersList) {
    console.warn(
      "Reminders list element (.reminders-list) not found. Skipping rendering reminders page list."
    );
    return;
  }

  remindersList.innerHTML = "";
  const sortedReminders = [...window.appData.reminders].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
  sortedReminders.forEach((reminder) => {
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

function checkReminders() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeString = `${currentHour
    .toString()
    .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

  let newNotificationsFound = false; // Flag to see if we added anything new

  // Check each reminder
  window.appData.reminders.forEach((reminder) => {
    // If the reminder is due and hasn't been notified yet
    if (reminder.time === currentTimeString && !reminder.notified) {
      // Mark as notified
      reminder.notified = true;

      // Add to active notifications
      window.appData.activeNotifications.push({
        id: reminder.id,
        text: reminder.text,
        // Store formatted time or keep original and format in notifications.js
        // Let's keep original and format in notifications.js using the imported formatTime
        time: reminder.time,
      });

      newNotificationsFound = true;
      console.log(`Reminder due: ${reminder.text} at ${reminder.time}`);
    }
  });

  if (newNotificationsFound) {
    updateNotificationBell();
    renderNotificationsList();
  }
}

function saveNewReminder() {
  const reminderTextEl = document.getElementById("reminderText");
  const reminderTimeEl = document.getElementById("reminderTime");

  if (!reminderTextEl || !reminderTimeEl) {
    console.error("Reminder input elements not found.");
    return;
  }

  const reminderText = reminderTextEl.value.trim();
  const reminderTime = reminderTimeEl.value;

  // Validate input
  if (!reminderText || !reminderTime) {
    alert("Please enter both text and time for the reminder");
    return;
  }

  // Generate a unique ID
  const newId =
    window.appData.reminders.length > 0
      ? Math.max(...window.appData.reminders.map((r) => r.id)) + 1
      : 1;

  // Create new reminder object
  const newReminder = {
    id: newId,
    text: reminderText,
    time: reminderTime, // Store time in HH:MM format
    notified: false,
  };

  // Add to reminders array
  window.appData.reminders.push(newReminder);

  // Re-render reminders list (the full list on the reminders page)
  renderReminders();

  // Clear and hide form
  reminderTextEl.value = "";
  reminderTimeEl.value = "";
  const formEl = document.querySelector(".add-reminder-form");
  if (formEl) formEl.classList.remove("show");

  // Check if the reminder should be shown immediately (if time is current)
  checkReminders();
}

function deleteReminder(id) {
  console.log("Attempting to delete reminder with id:", id);
  const idToDelete = parseInt(id, 10);

  // Remove from reminders array (the full list)
  const initialRemindersCount = window.appData.reminders.length;
  window.appData.reminders = window.appData.reminders.filter(
    (reminder) => reminder.id !== idToDelete
  );
  console.log(
    `Deleted reminder id ${idToDelete} from full list. Count before: ${initialRemindersCount}, after: ${window.appData.reminders.length}`
  );

  // Remove from active notifications (the list shown in the notification panel)
  const initialActiveCount = window.appData.activeNotifications.length;
  window.appData.activeNotifications =
    window.appData.activeNotifications.filter(
      (notification) => notification.id !== idToDelete
    );
  console.log(
    `Deleted reminder id ${idToDelete} from active notifications. Count before: ${initialActiveCount}, after: ${window.appData.activeNotifications.length}`
  );
  renderReminders();

  renderNotificationsList();

  updateNotificationBell();
}

export { initializeReminders, saveNewReminder, formatTime };
