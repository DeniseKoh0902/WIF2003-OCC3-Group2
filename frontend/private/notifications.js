import { formatTime } from "./utils.js";

let notificationBellEl = null;
let notificationPanelEl = null;
let notificationListEl = null; 
let outsideClickListener = null;

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

function renderNotificationsList() {
  if (!notificationListEl) {
    console.warn(
      "Notification list element (.notification-list) not found. Cannot render notifications."
    );
    return;
  }

  notificationListEl.innerHTML = "";

  const activeNotifications = window.appData.activeNotifications || []; 

  if (activeNotifications.length === 0) {
    const noNotificationsItem = document.createElement("div");
    noNotificationsItem.classList.add("notification-item");
    noNotificationsItem.style.padding = "10px";
    noNotificationsItem.style.textAlign = "center";
    noNotificationsItem.style.fontStyle = "italic";
    noNotificationsItem.style.color = "#bbb";

    noNotificationsItem.textContent = "No new notifications.";
    notificationListEl.appendChild(noNotificationsItem);
  } else {
    // Sort active notifications by time
    activeNotifications.sort((a, b) => a.time.localeCompare(b.time)); // Assuming time is HH:MM

    activeNotifications.forEach((notification) => {
      const notificationItem = document.createElement("div");
      notificationItem.classList.add("notification-item"); 
      notificationItem.dataset.id = notification.id;

      notificationItem.innerHTML = `
                <div class="notification-text">${notification.name}</div>
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
    shouldShow = !isCurrentlyShown;
  }

  if (shouldShow) {
    notificationPanelEl.classList.add("show");
    console.log("Notification panel shown.");
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

  // Initial render of notifications when the page loads 
  renderNotificationsList();
  updateNotificationBell();

  console.log(
    "Notifications module initialized successfully. Bell click listener attached."
  );
}

export {
  initializeNotifications,
  toggleNotificationPanel,
  renderNotificationsList,
  updateNotificationBell,
};
