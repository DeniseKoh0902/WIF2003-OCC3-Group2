/**
 * Notifications.js - Handles displaying and managing user notifications
 * Manages the notification bell UI and panel visibility
 */

// Import formatTime from reminders.js
// Assuming reminders.js is in the same directory or accessible like this
import { formatTime } from "./reminders.js";

let notificationBellEl = null;
let notificationPanelEl = null;
let notificationListEl = null; // Added reference to the list element
let outsideClickListener = null;

// Function to update the notification bell indicator (e.g., adding a badge count)
// This function needs to be implemented based on your HTML structure for the bell
function updateNotificationBell() {
  if (!notificationBellEl) {
    console.warn("Notification bell element not found. Cannot update bell.");
    return;
  }

  const notificationCount = window.appData.activeNotifications.length;
  console.log(
    "Updating notification bell. Active notifications:",
    notificationCount
  );

  let badgeEl = notificationBellEl.querySelector(".notification-badge");
  if (!badgeEl && notificationCount > 0) {
    badgeEl = document.createElement("span");
    badgeEl.classList.add("notification-badge");
    notificationBellEl.appendChild(badgeEl);
  }

  if (badgeEl) {
    if (notificationCount > 0) {
      badgeEl.textContent = notificationCount;
      badgeEl.style.display = "block";
    } else {
      badgeEl.style.display = "none";
    }
  }
}

/**
 * Renders the list of active notifications in the notification panel.
 * Reads data from window.appData.activeNotifications.
 */
function renderNotificationsList() {
  if (!notificationListEl) {
    console.warn(
      "Notification list element (.notification-list) not found. Cannot render notifications."
    );
    return;
  }

  notificationListEl.innerHTML = ""; // Clear current list

  const activeNotifications = window.appData.activeNotifications || []; // Ensure it's an array

  if (activeNotifications.length === 0) {
    const noNotificationsItem = document.createElement("div");
    noNotificationsItem.classList.add("notification-item"); // Use a similar class for styling
    noNotificationsItem.style.padding = "10px";
    noNotificationsItem.style.textAlign = "center";
    noNotificationsItem.style.fontStyle = "italic";
    noNotificationsItem.style.color = "#bbb";

    noNotificationsItem.textContent = "No new notifications.";
    notificationListEl.appendChild(noNotificationsItem);
  } else {
    // Optional: Sort active notifications by time if needed (they are added when due, but sorting might be nice)
    activeNotifications.sort((a, b) => a.time.localeCompare(b.time)); // Assuming time is HH:MM

    activeNotifications.forEach((notification) => {
      const notificationItem = document.createElement("div");
      notificationItem.classList.add("notification-item"); // Use a class for styling
      // Add data attributes if needed, e.g., to handle clicking on a notification
      notificationItem.dataset.id = notification.id;

      notificationItem.innerHTML = `
                <div class="notification-text">${notification.text}</div>
                <div class="notification-time">${formatTime(
                  notification.time
                )}</div>
                ${"" /* Optional: Add a close/dismiss button */}
                ${
                  "" /* <button class="dismiss-notification" data-id="${notification.id}">&times;</button> */
                }
            `;

      notificationListEl.appendChild(notificationItem);
    });
  }
  console.log("Notifications list rendered.");
}

function toggleNotificationPanel(show) {
  if (!notificationPanelEl) {
    console.warn(
      "Notification panel element not found. Cannot toggle visibility."
    );
    return;
  }

  const isCurrentlyShown = notificationPanelEl.classList.contains("show");
  let shouldShow;

  if (typeof show === "boolean") {
    shouldShow = show;
  } else {
    shouldShow = !isCurrentlyShown; // Toggle
  }

  if (shouldShow) {
    notificationPanelEl.classList.add("show");
    console.log("Notification panel shown.");
    // >>> Call renderNotificationsList when panel is shown <<<
    renderNotificationsList();
  } else {
    notificationPanelEl.classList.remove("show");
    console.log("Notification panel hidden.");
  }

  // Manage outside click listener
  if (notificationPanelEl.classList.contains("show")) {
    if (!outsideClickListener) {
      outsideClickListener = (e) => {
        // Check if the click target is outside both the bell and the panel
        // Use closest() for more robust checking against parent elements
        const clickedBell = e.target.closest(".notification-bell");
        const clickedPanel = e.target.closest(".notification-panel");

        if (!clickedBell && !clickedPanel) {
          console.log("Clicked outside notification panel, closing.");
          toggleNotificationPanel(false);
        }
      };
      // Add the listener to the document
      document.addEventListener("click", outsideClickListener);
      console.log("Added outside click listener for notification panel.");
    }
  } else {
    // If panel is hidden, remove the listener
    if (outsideClickListener) {
      document.removeEventListener("click", outsideClickListener);
      outsideClickListener = null; // Clear the reference
      console.log("Removed outside click listener for notification panel.");
    }
  }
}

function initializeNotifications() {
  console.log("Notifications module initializing...");
  notificationBellEl = document.querySelector(".notification-bell");
  notificationPanelEl = document.querySelector(".notification-panel");
  // Get the list element specifically
  notificationListEl = notificationPanelEl
    ? notificationPanelEl.querySelector(".notification-list")
    : null;

  if (!notificationBellEl || !notificationPanelEl || !notificationListEl) {
    console.error(
      "Notification bell (.notification-bell), panel (.notification-panel), or list (.notification-list) element not found. Cannot initialize notification UI."
    );
    return; // debugging for missing elements
  }

  // Initialize window.appData.activeNotifications if it doesn't exist
  if (!window.appData) {
    window.appData = {};
  }
  if (!window.appData.activeNotifications) {
    window.appData.activeNotifications = [];
  }
  console.log(
    "window.appData.activeNotifications initialized:",
    window.appData.activeNotifications
  );

  notificationBellEl.addEventListener("click", function (e) {
    e.stopPropagation();
    console.log("Notification bell clicked.");
    toggleNotificationPanel();
  });

  // Initial render of notifications when the page loads (if any were persisted)
  renderNotificationsList();
  // Initial update of the bell based on any persisted notifications
  updateNotificationBell();

  console.log(
    "Notifications module initialized successfully. Bell click listener attached."
  );
}

// Export functions needed elsewhere
export {
  initializeNotifications,
  toggleNotificationPanel,
  renderNotificationsList,
  updateNotificationBell,
};
