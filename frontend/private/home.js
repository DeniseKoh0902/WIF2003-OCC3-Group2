let currentEditingStat = null;
let dailyGoals = {
  steps: { goal: 10000, current: 0 },
  calories: { goal: 800, current: 0 },
  minutes: { goal: 60, current: 0 },
  water: { goal: 8, current: 0 } // in liters
};

//array of motivational quotes
const motivationalQuotes = [
  "Every step counts towards your goals. Keep pushing forward!",
  "Consistency is the key to success. You've got this!",
  "The only bad workout is the one that didn't happen.",
  "Your body achieves what your mind believes.",
  "Progress takes time. Celebrate every small victory!",
  "You're stronger than you think. Keep going!",
  "The secret of getting ahead is getting started.",
  "Don't stop when you're tired. Stop when you're done.",
  "Success starts with self-discipline.",
  "You didn't come this far to only come this far."
];

document.addEventListener('DOMContentLoaded', async () => {
  try {
    //fetch user data
    const res = await fetch("/api/profile", {
      method: "GET",
      credentials: "include"
    });

    if (!res.ok) throw new Error("Failed to fetch user data");
    
    const user = await res.json();
    
    //display username
    document.getElementById('username').textContent = user.username + "!" || 'User';
    
    // fetch daily streak separately
    try {
      const streakRes = await fetch('/api/profile/streak', {
        method: 'GET',
        credentials: 'include'
      });

      if (streakRes.ok) {
        const { streak } = await streakRes.json();
        document.getElementById('userStreak').textContent = `${streak} day${streak !== 1 ? 's' : ''}`;
      }
    } catch (streakErr) {
      console.error("Error fetching streak:", streakErr);
    }

    //Set current date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', options);
    
    //display random motivational quote
    displayRandomQuote();
    setInterval(displayRandomQuote, 24 * 60 * 60 * 1000);
    
    //load user goals from backend
    const goalsRes = await fetch('/api/daily-goals', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (goalsRes.ok) {
      const goalsData = await goalsRes.json();
      if (goalsData) {
        dailyGoals = {
          steps: { 
            goal: goalsData.steps_goal || 10000, 
            current: goalsData.total_steps || 0 
          },
          calories: { 
            goal: goalsData.calories_burned_goal || 800, 
            current: goalsData.total_calories_burned || 0 
          },
          minutes: { 
            goal: goalsData.time_goal || 60, 
            current: goalsData.total_time || 0 
          },
          water: { 
            goal: goalsData.water_intake_goal || 2, 
            current: goalsData.total_water_intake || 0 
          }
        };
      }
    }
    
    updateAllStatCards();
    loadRecentWorkouts(user._id);

    const workoutTotals = await getDailyWorkoutTotals(user._id);
    dailyGoals.calories.current = workoutTotals.caloriesBurned;
    dailyGoals.minutes.current = workoutTotals.activeMinutes;
    updateStatCard('calories');
    updateStatCard('minutes');

    //stat card click handle
    document.querySelectorAll('.btn-edit-goal').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const statType = this.getAttribute('data-stat');
        
        // Debugging
        console.log('Opening modal for:', statType);
        
        // Verify modal element exists
        if (!document.getElementById('dailyGoalModal')) {
          console.error('Modal element not found!');
          return;
        }
        
        // Verify bootstrap is loaded
        if (typeof bootstrap === 'undefined' || !bootstrap.Modal) {
          console.error('Bootstrap not loaded properly!');
          return;
        }
        
        showGoalModal(statType);
      });
    });

    //modal save button
    document.getElementById('modal-save-btn').addEventListener('click', saveDailyGoal);

  } catch (err) {
    console.error('Error loading dashboard:', err);
    //fallback display
    document.getElementById('username').textContent = 'User';
    document.getElementById('userStreak').textContent = '0 days';
    updateAllStatCards(); //use default values
  }
});

function displayRandomQuote() {
  const quoteElement = document.querySelector('.motivation-card .quote');
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  const newQuote = motivationalQuotes[randomIndex];

  if (quoteElement) {
    quoteElement.textContent = newQuote;
    console.log("Quote updated to:", newQuote);
  } else {
    console.error("Quote element not found!");
  }
}

function updateAllStatCards() {
  updateStatCard('steps');
  updateStatCard('calories');
  updateStatCard('minutes');
  updateStatCard('water');
}

function updateStatCard(statType) {
  const goal = dailyGoals[statType].goal;
  const current = dailyGoals[statType].current;
  const percentage = Math.min(Math.round((current / goal) * 100), 100);

  document.getElementById(`${statType}-value`).textContent = formatStatValue(statType, current);
  document.getElementById(`${statType}-goal`).textContent = `${percentage}% of daily goal`;
}

function formatStatValue(statType, value) {
  switch(statType) {
    case 'steps': return `${value.toLocaleString()} steps`;
    case 'calories': return `${value} kcal`;
    case 'minutes': return `${value} mins`;
    case 'water': return `${value.toFixed(1)} L`;
    default: return value;
  }
}

function showGoalModal(statType) {
    console.log('Attempting to show modal for:', statType);
    currentEditingStat = statType;
    const goal = dailyGoals[statType]?.goal || 0;
    const current = dailyGoals[statType]?.current || 0;

    const statTitles = {
        steps: 'Daily Steps',
        calories: 'Calories Burned',
        minutes: 'Active Minutes',
        water: 'Water Intake'
    };

    // Update modal content
    document.getElementById('modal-stat-title').textContent = statTitles[statType];
    document.getElementById('modal-goal').textContent = formatStatValue(statType, goal);
    document.getElementById('modal-progress').textContent = formatStatValue(statType, current);
    document.getElementById('modal-new-goal').value = goal;

    // Show/hide progress input based on stat type
    const progressContainer = document.getElementById('progress-input-container');
    if (statType === 'steps' || statType === 'water') {
        progressContainer.style.display = 'block';
        document.getElementById('modal-current-progress').value = current;
        document.getElementById('modal-current-progress').placeholder = 
            statType === 'steps' ? 'Enter current steps' : 'Enter current liters';
    } else {
        progressContainer.style.display = 'none';
    }

    // Show the modal
    const goalModal = new bootstrap.Modal(document.getElementById('dailyGoalModal'));
    goalModal.show();
}

async function saveDailyGoal() {
    const newGoalValue = parseInt(document.getElementById('modal-new-goal').value);
    const progressContainer = document.getElementById('progress-input-container');
    let currentProgressValue = null;

    if (progressContainer.style.display !== 'none') {
        currentProgressValue = parseFloat(document.getElementById('modal-current-progress').value);
        if (isNaN(currentProgressValue) || currentProgressValue < 0) {
            alert('Please enter a valid progress value');
            return;
        }
    }

    if (isNaN(newGoalValue) || newGoalValue <= 0) {
        alert('Please enter a valid positive number for goal');
        return;
    }

    try {
        // Update local state
        dailyGoals[currentEditingStat].goal = newGoalValue;
        if (currentProgressValue !== null) {
            dailyGoals[currentEditingStat].current = currentProgressValue;
        }
        updateStatCard(currentEditingStat);
        
        // Prepare update data
        const updateData = {
            statType: currentEditingStat,
            newGoal: newGoalValue
        };
        
        // Add current progress if available
        if (currentProgressValue !== null) {
            updateData.currentProgress = currentProgressValue;
        }

        const updateRes = await fetch('/api/daily-goals', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(updateData)
        });

        if (!updateRes.ok) {
            throw new Error('Failed to save goal and progress');
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('dailyGoalModal'));
        modal.hide();
        
    } catch (err) {
        console.error('Error saving goal:', err);
        alert('Failed to save changes. Please try again.');
    }
}

//Load top 4 recent workouts
async function loadRecentWorkouts(userId) {
  const container = document.getElementById('recent-workouts-container');
  if (!container) return console.error('recent-workouts container not found');

  try {
    //get workout history
    const res = await fetch(`/api/workout-history/user/${userId}`);
    if (!res.ok) throw new Error(`History fetch failed (${res.status})`);
    const history = (await res.json()).slice(0, 4);   // top 4

    //clear placeholder
    container.innerHTML = '';

    //build each card
    for (const entry of history) {
      let title = 'Workout', img = null;

      if (entry.workout_id) {
        // manual workout (has pic)
        const w = await fetchJSON(`/api/workouts/${entry.workout_id}`);
        title = w?.workout_name || 'Workout';
        img   = w?.workout_pic  || null;
      } else if (entry.plan_id) {
        //workout plan (no pic)\
        const p = await fetchJSON(`/api/workout-plans/by-object-id/${entry.plan_id}`);
        title = p?.plan_name || 'Workout Plan';
        img   = './images/home/workoutPlan.png';
      }

      const seconds = entry.duration ?? 0;
      const durationText = formatDuration(seconds);

      const card = document.createElement('div');
      card.className = 'workout-card';
      card.innerHTML = `
        ${img
          ? `<img src="${img}" alt="${title}" class="workout-thumb" />`
          : `<div class="workout-image-placeholder"></div>`
        }
        <h3>${title}</h3>
        <div class="workout-details">
          <span>${durationText}</span>
          <span>${entry.calories_burned ?? 0} kcal</span>
        </div>
      `;

      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        window.location.href = '/private/workout.html';
      });

      container.appendChild(card);
    }
  } catch (err) {
    console.error('Error loading recent workouts:', err);
  }
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins > 0 && secs > 0) {
    return `${mins} min ${secs} sec`;
  } else if (mins > 0) {
    return `${mins} min`;
  } else {
    return `${secs} sec`;
  }
}

//calculate daily workout totals
async function getDailyWorkoutTotals(userId) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // End of day

    // Fetch workout history for today
    const response = await fetch(`/api/workout-history/user/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const history = await response.json();
    
    // Filter for today's workouts only
    const todaysWorkouts = history.filter(item => {
      const workoutDate = new Date(item.workout_date);
      return workoutDate >= today && workoutDate <= endOfDay;
    });

    // Calculate totals
    let totalCalories = 0;
    let totalMinutes = 0;

    todaysWorkouts.forEach(item => {
      // Convert seconds to minutes for duration
      totalMinutes += Math.round(item.duration / 60);
      totalCalories += item.calories_burned || 0;
    });

    return {
      activeMinutes: totalMinutes,
      caloriesBurned: totalCalories
    };

  } catch (error) {
    console.error("Error calculating daily workout totals:", error);
    return {
      activeMinutes: 0,
      caloriesBurned: 0
    };
  }
}

async function fetchJSON(url) {
  try {
    const r = await fetch(url, { credentials: 'include' });
    if (!r.ok) throw new Error(`bad status ${r.status}`);
    return r.json();
  } catch (e) {
    console.error(`fetch ${url} failed:`, e);
    return null;
  }
}