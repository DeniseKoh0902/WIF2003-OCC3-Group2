document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const timerDisplay = document.getElementById("timer");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const exerciseNameEl = document.getElementById("exercise-name");
  const exerciseDescEl = document.getElementById("exercise-description");

  // Exercise Data from URL
  const urlParams = new URLSearchParams(window.location.search);
  const exerciseName = decodeURIComponent(
    urlParams.get("exercise") || "Exercise"
  );
  const exerciseDesc = decodeURIComponent(
    urlParams.get("desc") || "Let’s get moving!"
  );
  const exerciseTime = parseInt(urlParams.get("time")) || 1800; // Default: 30 minutes

  // Timer State
  let timeLeft = exerciseTime;
  let timerInterval;
  let isPaused = false;

  // Format seconds into HH:MM:SS
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

          // Show custom alert
          document.getElementById("exercise-done-name").textContent =
            exerciseName;
          document.getElementById("custom-alert").style.display = "flex";

          // Optional auto-redirect after 5 seconds
          // setTimeout(() => {
          //   window.location.href = "workout.html#manual-workout";
          // }, 5000);

          resetTimer();
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
    timeLeft = exerciseTime;
    updateDisplay();
    startBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
    resetBtn.style.display = "none";
    isPaused = false;
    pauseBtn.textContent = "Pause";
  }

  // Initialize display
  exerciseNameEl.textContent = exerciseName;
  exerciseDescEl.textContent = exerciseDesc;
  updateDisplay();

  // Event Listeners
  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);
});

