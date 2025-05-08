// /**
//  * notifications.js
//  * Manages notification system for CHARMSYNC fitness tracker
//  * Handles bell icon interaction, scheduled notifications, and reminder management
//  */

// // Notifications module using IIFE pattern for encapsulation
// const Notifications = (function() {
//     // Private variables
//     let activeNotifications = [];
//     let notificationPanel = null;
//     let bellIcon = null;
//     let bellCounter = null;
//     let notificationSound = null;
//     let isNotificationPanelOpen = false;
    
//     // Cache DOM elements
//     const cacheDOM = () => {
//         bellIcon = document.getElementById('notification-bell');
//         bellCounter = document.getElementById('notification-counter');
//         notificationPanel = document.getElementById('notification-panel');
        
//         // Create audio element for notification sound
//         notificationSound = new Audio('assets/notification-sound.mp3');
//         // Fallback in case the file doesn't exist
//         notificationSound.onerror = () => {
//             console.log('Notification sound file not found. Using default sound.');
//             notificationSound = null;
//         };
//     };
    
//     // Set up event listeners
//     const bindEvents = () => {
//         if (bellIcon) {
//             bellIcon.addEventListener('click', toggleNotificationPanel);
//         }
        
//         // Close notification panel when clicking outside of it
//         document.addEventListener('click', (e) => {
//             if (isNotificationPanelOpen && 
//                 e.target !== bellIcon && 
//                 e.target !== notificationPanel && 
//                 !notificationPanel.contains(e.target)) {
//                 hideNotificationPanel();
//             }
//         });
        
//         // Listen for reminder triggers
//         document.addEventListener('reminder:triggered', handleReminderTrigger);
//     };
    
//     // Toggle notification panel visibility
//     const toggleNotificationPanel = (e) => {
//         e.stopPropagation();
        
//         if (isNotificationPanelOpen) {
//             hideNotificationPanel();
//         } else {
//             showNotificationPanel();
//         }
//     };
    
//     // Show the notification panel
//     const showNotificationPanel = () => {
//         if (notificationPanel) {
//             notificationPanel.classList.add('visible');
//             isNotificationPanelOpen = true;
//             renderNotificationList();
//         }
//     };
    
//     // Hide the notification panel
//     const hideNotificationPanel = () => {
//         if (notificationPanel) {
//             notificationPanel.classList.remove('visible');
//             isNotificationPanelOpen = false;
//         }
//     };
    
//     // Handle triggered reminders
//     const handleReminderTrigger = (event) => {
//         const reminder = event.detail;
//         addNotification({
//             id: `notification-${Date.now()}`,
//             title: 'Reminder',
//             message: reminder.note || 'Your scheduled activity',
//             type: 'reminder',
//             timestamp: new Date(),
//             reminderId: reminder.id
//         });
//     };
    
//     // Add a new notification
//     const addNotification = (notification) => {
//         activeNotifications.push(notification);
//         updateNotificationCounter();
//         playNotificationSound();
//         animateBellIcon();
        
//         // If panel is open, update it
//         if (isNotificationPanelOpen) {
//             renderNotificationList();
//         }
        
//         // Optional: Display browser notification if supported and permission granted
//         showBrowserNotification(notification);
        
//         return notification.id;
//     };
    
//     // Remove a notification by ID
//     const removeNotification = (notificationId) => {
//         const index = activeNotifications.findIndex(n => n.id === notificationId);
        
//         if (index !== -1) {
//             // If it's a reminder notification, mark the reminder as read
//             const notification = activeNotifications[index];
//             if (notification.type === 'reminder' && notification.reminderId) {
//                 Reminders.markAsRead(notification.reminderId);
//             }
            
//             // Remove from active notifications
//             activeNotifications.splice(index, 1);
//             updateNotificationCounter();
            
//             // Update panel if open
//             if (isNotificationPanelOpen) {
//                 renderNotificationList();
//             }
            
//             return true;
//         }
        
//         return false;
//     };
    
//     // Clear all notifications
//     const clearAllNotifications = () => {
//         // Mark all reminder notifications as read
//         activeNotifications.forEach(notification => {
//             if (notification.type === 'reminder' && notification.reminderId) {
//                 Reminders.markAsRead(notification.reminderId);
//             }
//         });
        
//         activeNotifications = [];
//         updateNotificationCounter();
        
//         if (isNotificationPanelOpen) {
//             renderNotificationList();
//         }
//     };
    
//     // Update the notification counter badge
//     const updateNotificationCounter = () => {
//         if (bellCounter) {
//             const count = activeNotifications.length;
            
//             if (count > 0) {
//                 bellCounter.textContent = count > 99 ? '99+' : count;
//                 bellCounter.classList.add('visible');
//             } else {
//                 bellCounter.textContent = '';
//                 bellCounter.classList.remove('visible');
//             }
//         }
//     };
    
//     // Create and display notification list in panel
//     const renderNotificationList = () => {
//         if (!notificationPanel) return;
        
//         // Clear current content
//         notificationPanel.innerHTML = '';
        
//         // Add header
//         const header = document.createElement('div');
//         header.className = 'notification-header';
//         header.innerHTML = `
//             <h3>Notifications</h3>
//             <button id="clear-all-notifications" class="clear-all-btn">Clear All</button>
//         `;
//         notificationPanel.appendChild(header);
        
//         // Add notifications or empty state
//         if (activeNotifications.length === 0) {
//             const emptyState = document.createElement('div');
//             emptyState.className = 'empty-notifications';
//             emptyState.textContent = 'No new notifications';
//             notificationPanel.appendChild(emptyState);
//         } else {
//             // Create a list for notifications
//             const notificationList = document.createElement('ul');
//             notificationList.className = 'notification-list';
            
//             // Add each notification
//             activeNotifications.forEach(notification => {
//                 const notificationItem = createNotificationElement(notification);
//                 notificationList.appendChild(notificationItem);
//             });
            
//             notificationPanel.appendChild(notificationList);
//         }
        
//         // Add event listener to clear all button
//         const clearAllBtn = document.getElementById('clear-all-notifications');
//         if (clearAllBtn) {
//             clearAllBtn.addEventListener('click', clearAllNotifications);
//         }
//     };
    
//     // Create a notification list item element
//     const createNotificationElement = (notification) => {
//         const listItem = document.createElement('li');
//         listItem.className = `notification-item ${notification.type}`;
//         listItem.setAttribute('data-id', notification.id);
        
//         // Format time
//         const timeString = formatNotificationTime(notification.timestamp);
        
//         // Build notification content
//         listItem.innerHTML = `
//             <div class="notification-content">
//                 <div class="notification-title">${notification.title}</div>
//                 <div class="notification-message">${notification.message}</div>
//                 <div class="notification-time">${timeString}</div>
//             </div>
//             <button class="notification-dismiss">×</button>
//         `;
        
//         // Add event listener to dismiss button
//         const dismissBtn = listItem.querySelector('.notification-dismiss');
//         if (dismissBtn) {
//             dismissBtn.addEventListener('click', (e) => {
//                 e.stopPropagation();
//                 removeNotification(notification.id);
//             });
//         }
        
//         // Make the entire notification clickable
//         listItem.addEventListener('click', () => {
//             // Handle notification click - for example, navigate to related content
//             handleNotificationClick(notification);
//             removeNotification(notification.id);
//         });
        
//         return listItem;
//     };
    
//     // Format notification time display
//     const formatNotificationTime = (timestamp) => {
//         const now = new Date();
//         const notificationDate = new Date(timestamp);
//         const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
        
//         if (diffInMinutes < 1) {
//             return 'Just now';
//         } else if (diffInMinutes < 60) {
//             return `${diffInMinutes} min ago`;
//         } else if (diffInMinutes < 1440) { // Less than 24 hours
//             const hours = Math.floor(diffInMinutes / 60);
//             return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
//         } else {
//             // Format as date if older than a day
//             return notificationDate.toLocaleDateString();
//         }
//     };
    
//     // Handle notification click based on type
//     const handleNotificationClick = (notification) => {
//         console.log('Notification clicked:', notification);
        
//         // Different actions based on notification type
//         switch (notification.type) {
//             case 'reminder':
//                 // Navigate to related reminder page or show reminder details
//                 // For example:
//                 if (notification.reminderId) {
//                     // Could navigate to specific section or show a modal
//                     const event = new CustomEvent('notification:clicked', {
//                         detail: {
//                             type: 'reminder',
//                             id: notification.reminderId
//                         }
//                     });
//                     document.dispatchEvent(event);
//                 }
//                 break;
                
//             case 'workout':
//                 // Navigate to workout details
//                 break;
                
//             case 'goal':
//                 // Navigate to goals section
//                 break;
                
//             default:
//                 // Default action
//                 break;
//         }
//     };
    
//     // Animate the bell icon when a new notification arrives
//     const animateBellIcon = () => {
//         if (bellIcon) {
//             bellIcon.classList.add('animate');
            
//             // Remove animation class after animation completes
//             setTimeout(() => {
//                 bellIcon.classList.remove('animate');
//             }, 1000);
//         }
//     };
    
//     // Play notification sound
//     const playNotificationSound = () => {
//         if (notificationSound) {
//             notificationSound.play().catch(err => {
//                 console.log('Could not play notification sound:', err);
//             });
//         }
//     };
    
//     // Show browser notification (if supported and permission granted)
//     const showBrowserNotification = (notification) => {
//         if ('Notification' in window) {
//             if (Notification.permission === 'granted') {
//                 new Notification('CHARMSYNC', {
//                     body: notification.message,
//                     icon: '/assets/favicon.ico'
//                 });
//             } else if (Notification.permission !== 'denied') {
//                 Notification.requestPermission().then(permission => {
//                     if (permission === 'granted') {
//                         new Notification('CHARMSYNC', {
//                             body: notification.message,
//                             icon: '/assets/favicon.ico'
//                         });
//                     }
//                 });
//             }
//         }
//     };
    
//     // Check reminders and schedule notifications
//     const checkAndScheduleReminders = () => {
//         const reminders = Reminders.getAllReminders();
        
//         reminders.forEach(reminder => {
//             if (!reminder.isRead) {
//                 const reminderTime = new Date(reminder.time);
//                 const now = new Date();
                
//                 // If reminder time is in the past but within last hour and not yet notified
//                 if (reminderTime <= now && (now - reminderTime) <= 3600000 && !reminder.notified) {
//                     // Trigger notification
//                     handleReminderTrigger({ detail: reminder });
                    
//                     // Mark as notified
//                     Reminders.markAsNotified(reminder.id);
//                 }
//             }
//         });
//     };
    
//     // Start checking for reminders periodically
//     const startReminderChecker = () => {
//         // Check initially
//         checkAndScheduleReminders();
        
//         // Then check every minute
//         setInterval(checkAndScheduleReminders, 60000);
//     };
    
//     // Create a test notification for development
//     const createTestNotification = () => {
//         addNotification({
//             id: `notification-${Date.now()}`,
//             title: 'Test Notification',
//             message: 'This is a test notification to show how the system works',
//             type: 'system',
//             timestamp: new Date()
//         });
//     };
    
//     // Initialize the notification system
//     const init = () => {
//         cacheDOM();
//         bindEvents();
//         updateNotificationCounter();
//         startReminderChecker();
        
//         // For development/testing purposes - can be removed in production
//         // Uncomment to test notifications
//         // setTimeout(createTestNotification, 3000);
//     };
    
//     // Public API
//     return {
//         init,
//         addNotification,
//         removeNotification,
//         clearAllNotifications,
//         createTestNotification
//     };
// })();

// // Initialize notification system when DOM is fully loaded
// document.addEventListener('DOMContentLoaded', () => {
//     Notifications.init();
// });

// export default Notifications;