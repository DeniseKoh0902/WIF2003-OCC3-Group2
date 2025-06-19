async function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

let totalSeconds = 0;
function calculateTotalTime(steps) {
  steps.forEach((step) => {
    const seconds = parseInt(step.duration.replace("s", ""));
    totalSeconds += seconds;
  });

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0
    ? `${minutes} min${seconds ? ` ${seconds}s` : ""}`
    : `${seconds}s`;
}

async function getWorkoutPlan(type) {
  try {
    // Add debug log to show exact request URL
    const apiUrl = `/api/workout-plans/${encodeURIComponent(
      type.toLowerCase()
    )}`;
    console.log(`Making request to: ${apiUrl}`);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Details:", errorData);
      throw new Error(errorData.message || "Workout plan not found");
    }

    const result = await response.json();
    console.log("API Response Data:", result);
    console.log("result.data:", result.data); 
    // Transform data to match frontend structure
    return {
      plan_id: result.data.plan_id,
      name: result.data.plan_name,
      description: result.data.plan_description,
      calories: result.data.calories_burned,
      steps: result.data.steps
        .map((step) => ({
          name: step.step_name,
          duration: step.step_duration,
          order: step.step_order,
        }))
        .sort((a, b) => a.order - b.order),
    };
  } catch (error) {
    console.error("Error in getWorkoutPlan:", error);
    return null;
  }
}

function calculateTotalTimeInSeconds(steps) {
  return steps.reduce((total, step) => total + step.duration, 0);
}


// Define exerciseTime and caloriesBurned globally
let exerciseTime = 0;
let caloriesBurned = 0; // Or calculate if needed

async function loadWorkoutPlan() {
  const type = await getQueryParam("type") || "fullbody";
  console.log('Loading workout plan for type:', type); // Debugging
  
  const workout = await getWorkoutPlan(type);
  console.log('Workout data:', workout); // Debugging

  if (!workout) {
    document.getElementById("workout-header").innerHTML =
      "<p>Workout not found. Please check the URL or try another workout.</p>";
    return null;
  }

  // Set top info
  document.getElementById("workout-title").textContent = workout.name;
  document.getElementById("workout-description").textContent = workout.description;
  document.getElementById("total-time").textContent = calculateTotalTime(workout.steps);
  exerciseTime = totalSeconds;
  caloriesBurned = (document.getElementById("total-calories").textContent =
    workout.calories);

  // Load workout steps
  const workoutList = document.getElementById("workout-list");
  workoutList.innerHTML = ''; // Clear existing content
  
  workout.steps.forEach((w) => {
    const card = document.createElement("div");
    card.className = "workout-card";
    card.innerHTML = `
      <div>
        <h3>${w.name}</h3>
        <p>${w.duration}</p>
      </div>
    `;
    workoutList.appendChild(card);
  });

  return workout;
}

// Rest of your existing timer and event listener code remains the same...

document.addEventListener("DOMContentLoaded", async function () {
  const workout = await loadWorkoutPlan();
  if (!workout) return;

  // DOM Elements
  const timerDisplay = document.getElementById("timer");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const exerciseNameEl = document.getElementById("exercise-name");
  const startWorkoutBtn = document.getElementById("start-workout");
  const timerContainer = document.getElementById("timer-container");
  const exerciseDonePopup = document.getElementById("custom-alert");
  const userId = localStorage.getItem("userId");

  let currentStepIndex = 0;
  let timeLeft = parseDuration(workout.steps[currentStepIndex].duration);
  let timerInterval;
  let isPaused = false;

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
      h.toString().padStart(2, "0"),
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0"),
    ].join(":");
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
  }

  function parseDuration(duration) {
    const seconds = parseInt(duration.replace("s", ""));
    return seconds || 0;
  }

  function startTimer() {
    startBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
    resetBtn.style.display = "inline-block";

    clearInterval(timerInterval);
    isPaused = false;

    timerInterval = setInterval(() => {
      if (!isPaused) {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          loadNextStep();
        }
      }
    }, 1000);
  }

  function pauseTimer() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "Resume" : "Pause";
  }

  function resetTimer() {
    clearInterval(timerInterval);
    currentStepIndex = 0;
    timeLeft = parseDuration(workout.steps[currentStepIndex].duration);
    updateDisplay();
    startBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
    resetBtn.style.display = "none";
    isPaused = false;
    pauseBtn.textContent = "Pause";

    exerciseNameEl.textContent = workout.steps[currentStepIndex].name;
  }

  function loadNextStep() {
    currentStepIndex++;
    if (currentStepIndex < workout.steps.length) {
      const step = workout.steps[currentStepIndex];
      timeLeft = parseDuration(step.duration);
      exerciseNameEl.textContent = step.name;
      updateDisplay();
      startTimer();
    } else {
      showCompletionPopup();
    }
  }

  function showCompletionPopup() {
    document.getElementById("exercise-done-name").textContent = workout.name;
    exerciseDonePopup.style.display = "flex";

    saveWorkoutHistory();
  }

  // When user clicks "Start" below step list
  startWorkoutBtn.addEventListener("click", () => {
    timerContainer.style.display = "flex";
    exerciseNameEl.textContent = workout.steps[currentStepIndex].name;
    updateDisplay();
    startTimer(); // Start timer immediately
  });

  // Button events
  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  function saveWorkoutHistory() {
    const data = {
      user_id: userId,
      workout_id: null,
      plan_id: workout.plan_id,
      workout_date: new Date().toISOString(),
      duration: parseInt(exerciseTime),
      calories_burned: parseInt(caloriesBurned),
    };

    fetch("/api/workout-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Workout history saved:", result);
      })
      .catch((error) => {
        console.error("Failed to save:", error);
      });
  }
});
