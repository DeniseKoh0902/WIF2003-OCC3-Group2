/**
 * Reminders.js - Handles reminder creation, display, and management
 * Manages the reminders list and form functionality
 */

// Initialize reminders functionality
function initializeReminders() {
    console.log("initializeReminders() called");
    // Render existing reminders
    renderReminders();
    
    // Check for due reminders every minute
    setInterval(checkReminders, 60000);
    
    // Check once on page load
    checkReminders();
}

function renderReminders() {
    const remindersList = document.querySelector('.reminders-list');
    remindersList.innerHTML = '';
    
    // Sort reminders by time
    const sortedReminders = [...window.appData.reminders].sort((a, b) => {
        return a.time.localeCompare(b.time);
    });
    
    // Add each reminder to the list
    sortedReminders.forEach(reminder => {
        const reminderItem = document.createElement('div');
        reminderItem.className = 'reminder-item';
        reminderItem.dataset.id = reminder.id;
        
        reminderItem.innerHTML = `
            <div class="reminder-text">${reminder.text}</div>
            <div class="reminder-time">${formatTime(reminder.time)}</div>
        `;
        
        remindersList.appendChild(reminderItem);
    });
}

/**
 * Format time from 24-hour to 12-hour format
 * @param {string} time24 - Time in 24-hour format (HH:MM)
 * @returns {string} Time in 12-hour format with AM/PM
 */
function formatTime(time24) {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Check if any reminders are due
 */
function checkReminders() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    // Check each reminder
    window.appData.reminders.forEach(reminder => {
        // If the reminder is due and hasn't been notified yet
        if (reminder.time === currentTimeString && !reminder.notified) {
            // Mark as notified
            reminder.notified = true;
            
            // Add to active notifications
            window.appData.activeNotifications.push({
                id: reminder.id,
                text: reminder.text,
                time: reminder.time
            });
            
            // Update notification bell
            updateNotificationBell();
        }
    });
}

function saveNewReminder() {
    const reminderText = document.getElementById('reminderText').value.trim();
    const reminderTime = document.getElementById('reminderTime').value;
    
    // Validate input
    if (!reminderText || !reminderTime) {
        alert('Please enter both text and time for the reminder');
        return;
    }
    
    // Generate a unique ID
    const newId = window.appData.reminders.length > 0 
        ? Math.max(...window.appData.reminders.map(r => r.id)) + 1 
        : 1;
    
    // Create new reminder object
    const newReminder = {
        id: newId,
        text: reminderText,
        time: reminderTime,
        notified: false
    };
    
    // Add to reminders array
    window.appData.reminders.push(newReminder);
    
    // Re-render reminders list
    renderReminders();
    
    // Clear and hide form
    document.getElementById('reminderText').value = '';
    document.getElementById('reminderTime').value = '';
    document.querySelector('.add-reminder-form').classList.remove('show');
    
    // Check if the reminder should be shown immediately
    checkReminders();
}


function deleteReminder(id) {
    console.log("Attempting to delete reminder with id:", id);
    // Remove from reminders array
    const initialCount = window.appData.reminders.length;
    window.appData.reminders = window.appData.reminders.filter(reminder => reminder.id !== id);
     console.log(`Deleted reminder id ${id}. Count before: ${initialCount}, after: ${window.appData.reminders.length}`);


    // Remove from active notifications (optional, depending on your notification system)
    window.appData.activeNotifications = window.appData.activeNotifications.filter(
        notification => notification.id !== id
    );

    // Update UI - Re-render the list
    renderReminders();

    // Update notification bell - assuming updateNotificationBell is accessible
    // updateNotificationBell();
}

export { initializeReminders, saveNewReminder };