import {
    renderNotificationsList,
    updateNotificationBell,
} from "./notifications.js";
import { formatTime } from "./utils.js";

if (!window.appData) {
    window.appData = { reminders: [], activeNotifications: [] };
} else {
    if (!window.appData.reminders) {
        window.appData.reminders = [];
    }
    if (!window.appData.activeNotifications) {
        window.appData.activeNotifications = [];
    }
}

// Global state for delete mode
let isDeleteMode = false;
let selectedReminderIds = new Set(); 


/**
 * fetch & store from API in window.appData.reminders.
 * @returns {Array} 
 */
async function fetchReminders() {
    console.log("fetchReminders: Initiating fetch to /api/reminders");
    try {
        const response = await fetch('/api/reminders');
        if (!response.ok) {
            console.error(`fetchReminders: HTTP error! status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const reminders = await response.json();
        
        window.appData.reminders = reminders; 
        
        console.log("fetchReminders: Reminders fetched from backend:", reminders);
        return reminders;
    } catch (error) {
        console.error("fetchReminders: Error fetching reminders:", error);
        return [];
    }
}


async function initializeReminders() {
    console.log("initializeReminders() called in reminders.js");
    await fetchReminders(); 
    console.log("initializeReminders: Data after fetch:", window.appData.reminders);
    renderReminders(); 
    setupGlobalReminderEventListeners(); 
    setInterval(checkReminders, 60000); 
    checkReminders(); 
}


async function renderReminders() {
    console.log("renderReminders() called. isDeleteMode:", isDeleteMode);
    const remindersList = document.querySelector(".reminders-list");
    if (!remindersList) {
        console.warn(
            "renderReminders: Reminders list element (.reminders-list) not found. Skipping rendering."
        );
        return;
    }
    remindersList.innerHTML = "";
    const reminders = window.appData.reminders || [];
    console.log("renderReminders: Reminders array for rendering:", reminders);
    if (reminders.length === 0) {
        remindersList.innerHTML = '<p style="color: rgba(255,255,255,0.7); text-align: center;">No reminders yet. Click "Add Reminder" to create one!</p>';
        return;
    }

    const sortedReminders = [...reminders].sort((a, b) => {
        return a.time.localeCompare(b.time);
    });

    sortedReminders.forEach((reminder) => {
        const reminderItem = document.createElement("div");
        reminderItem.className = "reminder-item";
        reminderItem.dataset.id = reminder._id; // Use _id from MongoDB

        if (isDeleteMode && selectedReminderIds.has(reminder._id)) {
            reminderItem.classList.add('selected');
        }

        reminderItem.innerHTML = `
            <div class="reminder-details">
                <div class="reminder-name">${reminder.name}</div>
                <div class="reminder-time">${formatTime(reminder.time)}</div>
            </div>
            ${isDeleteMode ? `<input type="checkbox" class="reminder-checkbox" data-id="${reminder._id}" ${selectedReminderIds.has(reminder._id) ? 'checked' : ''}>` : ''}
        `;
        
        remindersList.appendChild(reminderItem);
        console.log("renderReminders: Appended reminder:", reminder.name);
    });
    if (isDeleteMode) {
        document.querySelectorAll('.reminder-item').forEach(item => {
            item.addEventListener('click', (event) => {
                const id = item.dataset.id;
                const checkbox = item.querySelector('.reminder-checkbox');        
                if (selectedReminderIds.has(id)) {
                    selectedReminderIds.delete(id);
                    item.classList.remove('selected');
                    if (checkbox) checkbox.checked = false;
                } else {
                    selectedReminderIds.add(id);
                    item.classList.add('selected');
                    if (checkbox) checkbox.checked = true;
                }
                console.log("Selected IDs:", Array.from(selectedReminderIds));
            });
            item.querySelectorAll('.reminder-checkbox').forEach(cb => {
                cb.addEventListener('click', (e) => e.stopPropagation());
            });
        });
    }
}


function toggleDeleteMode() {
    isDeleteMode = !isDeleteMode;
    selectedReminderIds.clear(); // Clear selections when toggling mode

    const deleteConfirmationBar = document.querySelector('.delete-confirmation-bar');
    const headerButtons = document.querySelector('.reminders-header .header-buttons'); // This one is not used directly
    const toggleDeleteButton = document.querySelector('.toggle-delete-mode');
    const addReminderButton = document.querySelector('.add-reminder'); // The plus button

    if (isDeleteMode) {
        deleteConfirmationBar?.classList.add('show');
        addReminderButton?.style.setProperty('display', 'none', 'important'); 
        toggleDeleteButton?.style.setProperty('background-color', 'rgba(244, 67, 54, 0.4)', 'important');
        toggleDeleteButton?.style.setProperty('color', '#fff', 'important');
    } else {
        deleteConfirmationBar?.classList.remove('show');
        addReminderButton?.style.removeProperty('display');
        toggleDeleteButton?.style.removeProperty('background-color');
        toggleDeleteButton?.style.removeProperty('color');
    }
    renderReminders();
}


async function confirmDeleteSelected() {
    if (selectedReminderIds.size === 0) {
        alert("No reminders selected for deletion.");
        return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedReminderIds.size} reminder(s)?`)) {
        console.log("Deletion cancelled by user.");
        return; 
    }
    console.log("Attempting to delete selected reminders:", Array.from(selectedReminderIds));
    const deletePromises = Array.from(selectedReminderIds).map(id => deleteReminder(id));
    try {
        await Promise.all(deletePromises); 
        console.log("All selected reminders deleted.");
        toggleDeleteMode(); 
    } catch (error) {
        console.error("Error during batch deletion:", error);
        alert("Failed to delete some reminders. Please check the console for details.");
    }
}


function cancelDeleteSelection() {
    console.log("Delete selection cancelled.");
    toggleDeleteMode(); 
}


function setupGlobalReminderEventListeners() {
    console.log("setupGlobalReminderEventListeners called.");
    const addReminderBtn = document.querySelector('.add-reminder');
    const addReminderForm = document.querySelector('.add-reminder-form');
    const saveReminderBtn = document.getElementById('saveReminder');
    const cancelReminderBtn = document.getElementById('cancelReminder');

    const toggleDeleteButton = document.querySelector('.toggle-delete-mode');
    const confirmDeleteBtn = document.getElementById('confirmDeleteSelected');
    const cancelDeleteBtn = document.getElementById('cancelDeleteSelection');


    if (addReminderBtn) {
        addReminderBtn.onclick = () => {
            if (!isDeleteMode) {
                addReminderForm?.classList.add('show');
            }
        };
    } else { console.warn("add-reminder button not found."); }

    if (cancelReminderBtn) {
        cancelReminderBtn.onclick = () => addReminderForm?.classList.remove('show');
    } else { console.warn("cancelReminder button not found."); }

    if (saveReminderBtn) {
        saveReminderBtn.onclick = saveNewReminder;
    } else { console.warn("saveReminder button not found."); }

    if (toggleDeleteButton) {
        toggleDeleteButton.addEventListener('click', toggleDeleteMode);
    } else { console.warn("toggle-delete-mode button not found."); }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeleteSelected);
        console.log("Attached listener to #confirmDeleteSelected");
    } else { console.warn("confirmDeleteSelected button not found."); }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', cancelDeleteSelection);
        console.log("Attached listener to #cancelDeleteSelection");
    } else { console.warn("cancelDeleteSelection button not found."); }
}


/**
 * Checks current time against reminders and triggers notifications if due.
 */
function checkReminders() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

    let newNotificationsFound = false;

    window.appData.reminders.forEach((reminder) => {
        if (reminder.time === currentTimeString && !reminder.notified) {
            reminder.notified = true; // Mark as notified in memory

            window.appData.activeNotifications.push({
                _id: reminder._id,
                name: reminder.name,
                time: reminder.time,
            });

            newNotificationsFound = true;
            console.log(`Reminder due: ${reminder.name} at ${reminder.time}`);
        }
    });

    if (newNotificationsFound) {
        updateNotificationBell();
        renderNotificationsList();
    }
}

async function saveNewReminder() {
    const reminderNameEl = document.getElementById("reminderName");
    const reminderTimeEl = document.getElementById("reminderTime");

    if (!reminderNameEl || !reminderTimeEl) {
        console.error("Reminder input elements (reminderName or reminderTime) not found.");
        return;
    }

    const name = reminderNameEl.value.trim();
    const time = reminderTimeEl.value;

    if (!name || !time) {
        alert("Please enter both name and time for the reminder.");
        return;
    }

    try {
        const response = await fetch('/api/reminders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, time, notified: false }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }

        const newReminder = await response.json();
        console.log("New reminder saved to backend:", newReminder);

        window.appData.reminders.push(newReminder);
        renderReminders();

        reminderNameEl.value = "";
        reminderTimeEl.value = "";
        const formEl = document.querySelector(".add-reminder-form");
        if (formEl) formEl.classList.remove("show");

        checkReminders();
    } catch (error) {
        console.error("Error saving new reminder:", error);
        alert(`Failed to save reminder: ${error.message}`);
    }
}


/**
 * Deletes a single reminder from the backend and updates the UI.
 * @param {string} id - 
 * @returns {Promise<void>} 
 */
async function deleteReminder(id) {
    console.log("Attempting to delete reminder with _id:", id);
    try {
        const response = await fetch(`/api/reminders/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }

        console.log(`Reminder with _id ${id} deleted from backend.`);

        // Remove from local appData.reminders array
        window.appData.reminders = window.appData.reminders.filter(
            (reminder) => reminder._id !== id
        );
        
        // Remove from local appData.activeNotifications array
        window.appData.activeNotifications = window.appData.activeNotifications.filter(
            (notification) => notification._id !== id
        );
    } catch (error) {
        console.error(`Error deleting reminder ${id}:`, error);
        throw error; // Re-throw to be caught by Promise.all in confirmDeleteSelected
    }
}

export { initializeReminders, saveNewReminder, deleteReminder, renderReminders };