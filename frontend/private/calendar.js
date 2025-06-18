let currentDate = new Date();
let currentMonth = currentDate.getMonth(); // 0-indexed
let currentYear = currentDate.getFullYear();
let calendarContainer = null;
let calendarHeaderEl = null;
let weekdaysEl = null;
let calendarDatesEl = null;

let workoutDaysInMonth = new Set(); 

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
}
async function fetchWorkoutsForCurrentMonth() {
    console.log(`Fetching workouts for ${currentYear}-${currentMonth + 1}`);
    try {
        const response = await fetch(`/api/WorkoutDays/month/${currentYear}/${currentMonth}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        workoutDaysInMonth.clear();
        data.forEach(day => workoutDaysInMonth.add(day));
        console.log("Fetched workout days:", Array.from(workoutDaysInMonth));
    } catch (error) {
        console.error('Error fetching workout days:', error);
        workoutDaysInMonth.clear(); // Clear to prevent stale data
    }
}

// Render the calendar for the current month and year
const renderCalendar = async () => { 
    if (!calendarContainer || !calendarHeaderEl || !weekdaysEl || !calendarDatesEl) {
        console.error("Calendar container or required inner elements not found. Cannot render.");
        return;
    }


    await fetchWorkoutsForCurrentMonth();

    calendarHeaderEl.innerHTML = ''; 
    weekdaysEl.innerHTML = '';     
    calendarDatesEl.innerHTML = ''; 

    // Previous month button
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&lt;';
    prevBtn.className = 'calendar-nav-btn'; 
    prevBtn.addEventListener('click', () => navigateMonth(-1));

    // Month and year display
    const monthYearText = document.createElement('div');
    monthYearText.className = 'month-year'; 
    monthYearText.textContent = getMonthYearString(currentMonth, currentYear);

    // Next month button
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&gt;';
    nextBtn.className = 'calendar-nav-btn'; 
    nextBtn.addEventListener('click', () => navigateMonth(1));

    calendarHeaderEl.appendChild(prevBtn);
    calendarHeaderEl.appendChild(monthYearText); 
    calendarHeaderEl.appendChild(nextBtn);

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
        const dayElem = document.createElement('div');
        dayElem.textContent = day;
        weekdaysEl.appendChild(dayElem);
    });

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'date empty'; 
        calendarDatesEl.appendChild(emptyCell);
    }

    for (let day = 1; day <= lastDate; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'date';
        dayCell.textContent = day;

        if (hasWorkout(day)) {
            dayCell.classList.add('workout'); 
        }

        // Highlight today's date
        if (isToday(currentYear, currentMonth, day)) {
            dayCell.classList.add('today');
        }

        dayCell.addEventListener('click', () => handleDayClick(day, currentMonth, currentYear));

        calendarDatesEl.appendChild(dayCell);
    }

    console.log(`Calendar rendered for ${getMonthYearString(currentMonth, currentYear)}`);
};

// Checks if a day has a workout (using the fetched workoutDaysInMonth Set)
const hasWorkout = (dayNumber) => {
    return workoutDaysInMonth.has(dayNumber);
};

const formatDateString = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const isToday = (year, month, day) => {
    const today = new Date();
    return (
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
    );
};

const navigateMonth = (direction) => {
    currentMonth += direction;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    renderCalendar(); 
};

const getMonthYearString = (month, year) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[month]} ${year}`;
};

// Handle day click event
const handleDayClick = async (day, month, year) => { 
    const dateString = formatDateString(year, month, day);
    console.log(`Selected date: ${dateString}`);

    const isCurrentlyWorkout = hasWorkout(day);

    if (isCurrentlyWorkout) {
        if (confirm(`Do you want to remove the workout for ${dateString}?`)) {
            await removeWorkout(dateString);
        }
    } else {
        if (confirm(`Do you want to add a workout for ${dateString}?`)) {
            await addWorkout(dateString);
        }
    }
};

/**
 * @param {string} dateString
 */
const addWorkout = async (dateString) => {
    try {
        const response = await fetch('/api/WorkoutDays', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: dateString }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }

        console.log(`Workout added for ${dateString}`);
        renderCalendar(); // Re-render to update the calendar view with the new workout
    } catch (error) {
        console.error(`Error adding workout for ${dateString}:`, error);
        alert(`Failed to add workout: ${error.message}`);
    }
};

/**
 * @param {string} dateString
 */
const removeWorkout = async (dateString) => {
    try {
        const response = await fetch(`/api/WorkoutDays/${dateString}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        }

        console.log(`Workout removed for ${dateString}`);
        renderCalendar();
    } catch (error) {
        console.error(`Error removing workout for ${dateString}:`, error);
        alert(`Failed to remove workout: ${error.message}`);
    }
};

export function initializeCalendar() {
    console.log('Initializing calendar');
    cacheDOM();
    renderCalendar();
}

export {
    navigateMonth,
    addWorkout,
    removeWorkout,
    renderCalendar 
};