const workouts = {
  fullbody: {
    name: "Full Body Workout",
    description: "Burn fat and build strength from head to toe",
    calories: "120 kcal",
    steps: [
      { name: "Squats", duration: "30s" },
      { name: "Wall Push-Ups", duration: "30s" },
      { name: "Plank", duration: "20s" },
      { name: "Claps Over Head", duration: "30s" },
    ],
  },
  abs: {
    name: "Abs Workout",
    description: "Flatten your belly with quick and easy ab moves",
    calories: "80 kcal",
    steps: [
      { name: "Crunches", duration: "30s" },
      { name: "Leg Raises", duration: "30s" },
      { name: "Plank Hold", duration: "20s" },
    ],
  },
  leg: {
    name: "Leg Workout",
    description: "Quick and simple exercises to tone your legs",
    calories: "90 kcal",
    steps: [
      { name: "Lunges", duration: "30s" },
      { name: "Wall Sit", duration: "30s" },
      { name: "Leg Raises", duration: "30s" },
    ],
  },
  butt: {
    name: "Butt Workout",
    description: "Build a stronger butt with simple daily moves",
    calories: "85 kcal",
    steps: [
      { name: "Glute Bridges", duration: "30s" },
      { name: "Donkey Kicks", duration: "30s" },
      { name: "Fire Hydrants", duration: "30s" },
    ],
  },
};

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function calculateTotalTime(steps) {
  let totalSeconds = 0;
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

function loadWorkoutPlan() {
  const type = getQueryParam("type") || "fullbody";
  const workout = workouts[type];

  if (!workout) {
    document.getElementById("workout-header").innerHTML =
      "<p>Workout not found.</p>";
    return;
  }

  // Set top info
  document.getElementById("workout-title").textContent = workout.name;
  document.getElementById("workout-description").textContent =
    workout.description;
  document.getElementById("total-time").textContent = calculateTotalTime(
    workout.steps
  );
  document.getElementById("total-calories").textContent = workout.calories;

  // Load workout steps
  const workoutList = document.getElementById("workout-list");
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
}

document.addEventListener("DOMContentLoaded", function () {
  loadWorkoutPlan();

  // DOM Elements
  const timerDisplay = document.getElementById("timer");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const exerciseNameEl = document.getElementById("exercise-name");
  const startWorkoutBtn = document.getElementById("start-workout");
  const timerContainer = document.getElementById("timer-container");
  const exerciseDonePopup = document.getElementById("custom-alert");

  const workoutType = getQueryParam("type") || "fullbody";
  const workout = workouts[workoutType];

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
  }

  // When user clicks "Start" below step list
  startWorkoutBtn.addEventListener("click", () => {
    timerContainer.style.display = "flex";
    exerciseNameEl.textContent = workout.steps[currentStepIndex].name;
    updateDisplay();
  });

  // Button events
  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);
});
