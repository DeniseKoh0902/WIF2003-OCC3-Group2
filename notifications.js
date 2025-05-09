/**
 * Notifications.js - Handles displaying and managing user notifications
 * Manages the notification bell UI and panel visibility
 */

let notificationBellEl = null;
let notificationPanelEl = null;
let outsideClickListener = null; 

function toggleNotificationPanel(show) {
    if (!notificationPanelEl) {
        console.warn("Notification panel element not found. Cannot toggle visibility.");
        return;
    }

    if (typeof show === 'boolean') {
        if (show) {
            notificationPanelEl.classList.add('show');
             console.log("Notification panel shown.");
        } else {
            notificationPanelEl.classList.remove('show');
             console.log("Notification panel hidden.");
        }
    } else {
        notificationPanelEl.classList.toggle('show');
         console.log("Notification panel toggled.");
    }
    if (notificationPanelEl.classList.contains('show')) {
        if (!outsideClickListener) {
             outsideClickListener = (e) => {
                 // Check if the click target is outside both the bell and the panel
                 const isBell = notificationBellEl && notificationBellEl.contains(e.target);
                 const isPanel = notificationPanelEl && notificationPanelEl.contains(e.target);

                 if (!isBell && !isPanel) {
                     console.log("Clicked outside notification panel, closing.");
                     toggleNotificationPanel(false);
                 }
             };
            document.addEventListener('click', outsideClickListener);
             console.log("Added outside click listener for notification panel.");
        }
    } else {
        // no panel, remove listener
        if (outsideClickListener) {
            document.removeEventListener('click', outsideClickListener);
            outsideClickListener = null; // Clear the reference
             console.log("Removed outside click listener for notification panel.");
        }
    }
}

function initializeNotifications() {
    console.log("Notifications module initializing...");
    notificationBellEl = document.querySelector('.notification-bell');
    notificationPanelEl = document.querySelector('.notification-panel');

    if (!notificationBellEl || !notificationPanelEl) {
        console.error("Notification bell (.notification-bell) or panel (.notification-panel) element not found. Cannot initialize notification UI.");
        return; // debugging for missing elements
    }
    notificationBellEl.addEventListener('click', function(e) {
        e.stopPropagation(); 
        console.log("Notification bell clicked.");
        toggleNotificationPanel(); 
    });

    console.log("Notifications module initialized successfully. Bell click listener attached.");
}

export { initializeNotifications, toggleNotificationPanel };

