/**
 * calendar.js
 * Handles calendar functionality for CHARMSYNC fitness tracker
 * Displays monthly calendar with workout days highlighted
 * Refactored to allow direct initialization via initializeCalendar()
 */

// Variables that were previously inside the IIFE, now at module scope
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let calendarContainer = null;
let calendarHeaderEl = null;
let weekdaysEl = null;
let calendarDatesEl = null;

let workoutDays = [5, 12, 20, 28]; 

// Cache DOM elements
const cacheDOM = () => {
    calendarContainer = document.getElementById('calendar-container');
    if (calendarContainer) {
        calendarHeaderEl = calendarContainer.querySelector('.calendar-header');
        weekdaysEl = calendarContainer.querySelector('.weekdays');
        calendarDatesEl = calendarContainer.querySelector('.calendar-dates');

        if (!calendarHeaderEl) console.warn("Calendar header element (.calendar-header) not found inside #calendar-container!");
        if (!weekdaysEl) console.warn("Calendar weekdays element (.weekdays) not found inside #calendar-container!");
        if (!calendarDatesEl) console.warn("Calendar dates element (.calendar-dates) not found inside #calendar-container!");

    } else {
         console.error("Calendar container element (#calendar-container) not found!");
    }
};

// Render the calendar for the current month and year
const renderCalendar = () => {
    // Ensure container elements are found
    if (!calendarContainer || !calendarHeaderEl || !weekdaysEl || !calendarDatesEl) {
        console.error("Calendar container or required inner elements not found. Cannot render.");
        return;
    }

    calendarHeaderEl.innerHTML = ''; // Clear header content (static month/year)
    weekdaysEl.innerHTML = '';     // Clear static weekdays
    calendarDatesEl.innerHTML = '';  // Clear static/previous dates
    // Previous month button
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&lt;';
    prevBtn.className = 'calendar-nav-btn'; // Keep this class if you style nav buttons
    prevBtn.addEventListener('click', () => navigateMonth(-1));

    // Month and year display
    // Create a div for the month/year text itself inside the header
    const monthYearText = document.createElement('div');
    monthYearText.className = 'month-year'; // Match the class from your HTML/CSS
    monthYearText.textContent = getMonthYearString(currentMonth, currentYear);


    // Next month button
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&gt;';
    nextBtn.className = 'calendar-nav-btn'; // Keep this class
    nextBtn.addEventListener('click', () => navigateMonth(1));

    // Append header elements to the existing header container
    calendarHeaderEl.appendChild(prevBtn);
    calendarHeaderEl.appendChild(monthYearText); // Append the dynamically created month/year text
    calendarHeaderEl.appendChild(nextBtn);

    // --- BUILD and APPEND content to the EXISTING weekdays element ---
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    weekdays.forEach(day => {
        const dayElem = document.createElement('div');
        dayElem.textContent = day;
        weekdaysEl.appendChild(dayElem); // Append to the existing weekdays container
    });


    // --- BUILD and APPEND content to the EXISTING dates element ---
    // Get the first day of the month (0 for Sunday, 6 for Saturday)
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    // Get the last date of the month
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Create empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'date empty'; // Use class 'date' + 'empty' to match CSS
        calendarDatesEl.appendChild(emptyCell); // Append to the existing dates container
    }

    // Create cells for each day of the month
    for (let day = 1; day <= lastDate; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'date'; // --- USE CLASS 'date' TO MATCH CSS ---
        dayCell.textContent = day;

        // Check if this day has a workout
        if (hasWorkout(day)) {
            dayCell.classList.add('workout'); // --- USE CLASS 'workout' TO MATCH CSS ---
        }

        // Highlight today's date
        if (isToday(currentYear, currentMonth, day)) {
            dayCell.classList.add('today'); // --- USE CLASS 'today' TO MATCH CSS ---
        }

        // Add click listener (uses the day number, month, year)
        dayCell.addEventListener('click', () => handleDayClick(day, currentMonth, currentYear));

        calendarDatesEl.appendChild(dayCell); // Append to the existing dates container
    }

     console.log(`Calendar rendered for ${getMonthYearString(currentMonth, currentYear)}`);
};

const formatDateString = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};
const hasWorkout = (dayNumber) => {
    return workoutDays.includes(dayNumber);
};

const isToday = (year, month, day) => {
    const today = new Date();
    return (
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
    );
};

// Navigate to previous or next month
const navigateMonth = (direction) => {
    currentMonth += direction;

    // Handle year change
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    renderCalendar();
};

// Get formatted month and year string (Helper function)
const getMonthYearString = (month, year) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[month]} ${year}`;
};

// Handle day click event
const handleDayClick = (day, month, year) => {
    const dateString = formatDateString(year, month, day);
    console.log(`Selected date: ${dateString}`);
    const event = new CustomEvent('calendar:daySelected', {
        detail: {
            date: dateString,
            hasWorkout: hasWorkout(day) // Pass day number consistent with hasWorkout logic
        }
    });
    document.dispatchEvent(event);
};

// Add a workout for a specific date (Adds the day number to workoutDays)
// This modifies the global workoutDays array and doesn't handle different months.
const addWorkout = (dateString) => {
    const day = parseInt(dateString.split('-')[2], 10); // Ensure base 10
    // Check if the day number is already in the array
    if (!workoutDays.includes(day)) {
        workoutDays.push(day);
        console.log(`Added workout for day ${day}. Current workoutDays:`, workoutDays);
        renderCalendar(); // Refresh the calendar to show the new workout day
    } else {
         console.log(`Day ${day} already has a workout.`);
    }
};

// Remove a workout for a specific date (Removes the day number from workoutDays)
// This modifies the global workoutDays array and doesn't handle different months.
const removeWorkout = (dateString) => {
    const day = parseInt(dateString.split('-')[2], 10); // Ensure base 10
    const index = workoutDays.indexOf(day);
    if (index !== -1) {
        workoutDays.splice(index, 1);
        console.log(`Removed workout for day ${day}. Current workoutDays:`, workoutDays);
        renderCalendar(); // Refresh the calendar to show the change
    } else {
        console.log(`Day ${day} did not have a workout.`);
    }
};

export function initializeCalendar() {
    console.log('Initializing calendar');
    cacheDOM(); // Find the calendar container
    renderCalendar(); // Draw the initial calendar view
}

export {
    navigateMonth,
    addWorkout,
    removeWorkout,
    renderCalendar 
};
