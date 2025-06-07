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

  const userId = urlParams.get("userId");
  const workoutId = urlParams.get("workoutId");
  const caloriesBurned = parseInt(urlParams.get("calories")) || 150; // from ?calories=150
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
          // Save workout history
          saveWorkoutHistory();

          // Show custom alert
          document.getElementById("exercise-done-name").textContent =
            exerciseName;
          document.getElementById("custom-alert").style.display = "flex";

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

  function saveWorkoutHistory() {
    const data = {
      user_id: userId,
      workout_id: workoutId,
      plan_id: null,
      workout_date: new Date().toISOString(),
      duration: exerciseTime,
      calories_burned: caloriesBurned,
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


// document.addEventListener("DOMContentLoaded", function () {
//   // DOM Elements
//   const timerDisplay = document.getElementById("timer");
//   const startBtn = document.getElementById("startBtn");
//   const pauseBtn = document.getElementById("pauseBtn");
//   const resetBtn = document.getElementById("resetBtn");
//   const exerciseNameEl = document.getElementById("exercise-name");
//   const exerciseDescEl = document.getElementById("exercise-description");
//   const exerciseImageEl = document.getElementById("exercise-image");
//   const customAlert = document.getElementById("custom-alert");
//   const closeAlertBtn = document.getElementById("close-alert");
//   const exerciseDoneName = document.getElementById("exercise-done-name");

//   // Get parameters from URL
//   const urlParams = new URLSearchParams(window.location.search);

//   // Exercise Data
//   const exerciseData = {
//     name: decodeURIComponent(urlParams.get("exercise") || "Exercise"),
//     description: decodeURIComponent(
//       urlParams.get("desc") || "Let's get moving!"
//     ),
//     duration: parseInt(urlParams.get("time")) || 1800, // Default: 30 minutes in seconds
//     image: decodeURIComponent(
//       urlParams.get("image") || "images/workout/default-exercise.png"
//     ),
//     category: decodeURIComponent(urlParams.get("category") || "General"),
//     workoutId: urlParams.get("workoutId"),
//     planId: urlParams.get("planId"),
//     isFromPlan: urlParams.get("fromPlan") === "true",
//   };

//   // Timer State
//   let timeLeft = exerciseData.duration;
//   let timerInterval;
//   let isPaused = false;
//   let isRunning = false;
//   let hasCompleted = false;

//   // Initialize the display
//   function initializeDisplay() {
//     exerciseNameEl.textContent = exerciseData.name;
//     exerciseDescEl.textContent = exerciseData.description;
//     if (exerciseImageEl) {
//       exerciseImageEl.src = exerciseData.image;
//       exerciseImageEl.alt = exerciseData.name;
//     }
//     updateTimerDisplay();

//     // Validate exercise data
//     if (!exerciseData.isFromPlan && !exerciseData.workoutId) {
//       console.warn("Standalone workout has no workoutId");
//     }

//     // Set up alert close button
//     if (closeAlertBtn) {
//       closeAlertBtn.addEventListener("click", function () {
//         customAlert.style.display = "none";
//       });
//     }
//   }

//   function formatTime(seconds) {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;

//     // Always show hours, even if zero
//     return `${hours.toString().padStart(2, "0")}:${minutes
//       .toString()
//       .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   }

//   function updateTimerDisplay() {
//     timerDisplay.textContent = formatTime(timeLeft);
//   }

//   // Calculate calories burned (simplified estimation)
//   function calculateCaloriesBurned(durationInMinutes) {
//     // Average calories burned per minute for moderate exercise
//     const caloriesPerMinute = 8;
//     return Math.round(durationInMinutes * caloriesPerMinute);
//   }

//   let currentUserId = null;

//   // Get current user (using session cookies)
//   async function fetchCurrentUser() {
//     try {
//       const response = await fetch("/api/current-user", {
//         method: "GET",
//         credentials: "include", // This sends cookies
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch user data");
//       }

//       const userData = await response.json();
//       currentUserId = userData._id;
//       console.log("Current user ID:", currentUserId);
//     } catch (err) {
//       console.error("Error fetching user data:", err);
//       throw err;
//     }
//   }

//   // Modified saveWorkoutHistory (using session cookies)
//   async function saveWorkoutHistory(workoutData) {
//     try {
//       console.log("Attempting to save workout:", workoutData);

//       const response = await fetch("/api/workout-history", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(workoutData),
//       });

//       const responseData = await response.json();
//       console.log("Server response:", responseData);

//       if (!response.ok) {
//         throw new Error(responseData.error || "Failed to save workout");
//       }

//       return responseData;
//     } catch (error) {
//       console.error("Save error:", {
//         message: error.message,
//         data: workoutData,
//         stack: error.stack,
//       });
//       throw error;
//     }
//   }

//   // Modified initializeDisplay to fetch user first
//   async function initializeDisplay() {
//     try {
//       await fetchCurrentUser();

//       exerciseNameEl.textContent = exerciseData.name;
//       exerciseDescEl.textContent = exerciseData.description;
//       if (exerciseImageEl) {
//         exerciseImageEl.src = exerciseData.image;
//         exerciseImageEl.alt = exerciseData.name;
//       }
//       updateTimerDisplay();

//       // [Rest of your existing initializeDisplay code...]
//     } catch (error) {
//       console.error("Initialization error:", error);
//       showError("Please login to track workouts");
//     }
//   }

//   // // Modified saveWorkoutHistory with better error handling
//   // async function saveWorkoutHistory(workoutData) {
//   //   try {
//   //     console.log("Attempting to save workout:", workoutData); // Debug log

//   //     const token = localStorage.getItem("token");
//   //     if (!token) {
//   //       throw new Error("No authentication token found");
//   //     }

//   //     const response = await fetch("/api/workout-history", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //       body: JSON.stringify({
//   //         ...workoutData,
//   //         image: exerciseData.image, // Ensure image is included
//   //       }),
//   //     });

//   //     console.log("Response status:", response.status); // Debug log

//   //     if (!response.ok) {
//   //       let errorData;
//   //       try {
//   //         errorData = await response.json();
//   //       } catch (e) {
//   //         errorData = { error: "Unknown server error" };
//   //       }
//   //       throw new Error(errorData.error || `Server error: ${response.status}`);
//   //     }

//   //     const result = await response.json();
//   //     console.log("Save successful:", result); // Debug log
//   //     return result;
//   //   } catch (error) {
//   //     console.error("Full error details:", {
//   //       error: error.message,
//   //       stack: error.stack,
//   //       workoutData,
//   //     });
//   //     throw error;
//   //   }
//   // }

//   // Enhanced logCompletedWorkout
//   async function logCompletedWorkout() {
//     if (hasCompleted) {
//       console.warn("Workout already completed");
//       return false;
//     }

//     const durationInMinutes = Math.round(exerciseData.duration / 60);
//     const caloriesBurned = calculateCaloriesBurned(durationInMinutes);

//     const workoutData = {
//       name: exerciseData.name,
//       category: exerciseData.category,
//       duration: durationInMinutes,
//       calories_burned: caloriesBurned,
//       description: exerciseData.description,
//       image: exerciseData.image, // Now included
//       workout_date: new Date().toISOString(),
//     };

//     // Handle different workout identification scenarios
//     if (exerciseData.isFromPlan && exerciseData.planId) {
//       workoutData.plan_id = exerciseData.planId;
//       console.log("Saving as plan workout");
//     } else if (exerciseData.workoutId) {
//       workoutData.workout_id = exerciseData.workoutId;
//       console.log("Saving as manual workout");
//     } else {
//       workoutData.custom_id = `standalone-${Date.now()}`;
//       console.log("Saving as standalone workout");
//     }

//     try {
//       const result = await saveWorkoutHistory(workoutData);
//       console.log("Workout logged successfully:", result);
//       return true;
//     } catch (error) {
//       console.error("Error logging workout:", error);
//       showError(`Failed to save: ${error.message}`);
//       return false;
//     }
//   }

//   // Show error message
//   function showError(message) {
//     const errorElement = document.createElement("div");
//     errorElement.className =
//       "alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3";
//     errorElement.style.zIndex = "1100";
//     errorElement.textContent = message;
//     document.body.appendChild(errorElement);

//     setTimeout(() => {
//       errorElement.remove();
//     }, 5000);
//   }

//   // Start the timer
//   function startTimer() {
//     if (isRunning) return;

//     isRunning = true;
//     isPaused = false;
//     startBtn.style.display = "none";
//     pauseBtn.style.display = "inline-block";
//     resetBtn.style.display = "inline-block";

//     timerInterval = setInterval(() => {
//       if (!isPaused) {
//         timeLeft--;
//         updateTimerDisplay();

//         if (timeLeft <= 0) {
//           clearInterval(timerInterval);
//           timerComplete();
//         }
//       }
//     }, 1000);
//   }

//   // Pause/resume the timer
//   function pauseTimer() {
//     isPaused = !isPaused;
//     pauseBtn.textContent = isPaused ? "Resume" : "Pause";

//     if (isPaused) {
//       timerDisplay.classList.add("text-warning");
//     } else {
//       timerDisplay.classList.remove("text-warning");
//     }
//   }

//   // Reset the timer
//   function resetTimer() {
//     clearInterval(timerInterval);
//     timeLeft = exerciseData.duration;
//     isRunning = false;
//     isPaused = false;
//     updateTimerDisplay();
//     startBtn.style.display = "inline-block";
//     pauseBtn.style.display = "none";
//     resetBtn.style.display = "none";
//     pauseBtn.textContent = "Pause";
//     timerDisplay.classList.remove("text-warning");
//     timerDisplay.classList.remove("text-danger");
//     timerDisplay.classList.remove("blink");
//   }

//   // Handle timer completion
//   async function timerComplete() {
//     try {
//       const success = await logCompletedWorkout();
//       if (success && customAlert) {
//         document.getElementById("exercise-done-name").textContent =
//           exerciseData.name;
//         customAlert.style.display = "flex";
//       }
//     } catch (error) {
//       console.error("Error completing workout:", error);
//     } finally {
//       resetTimer();
//     }
//   }

//   // Event Listeners
//   startBtn.addEventListener("click", startTimer);
//   pauseBtn.addEventListener("click", pauseTimer);
//   resetBtn.addEventListener("click", resetTimer);

//   // Keyboard shortcuts
//   document.addEventListener("keydown", function (e) {
//     if (e.code === "Space") {
//       e.preventDefault();
//       if (isRunning) {
//         pauseTimer();
//       } else {
//         startTimer();
//       }
//     } else if (e.code === "KeyR") {
//       resetTimer();
//     }
//   });

//   // Initialize the timer
//   initializeDisplay();
// });

// document.addEventListener("DOMContentLoaded", function () {
//   // DOM Elements
//   const timerDisplay = document.getElementById("timer");
//   const startBtn = document.getElementById("startBtn");
//   const pauseBtn = document.getElementById("pauseBtn");
//   const resetBtn = document.getElementById("resetBtn");
//   const exerciseNameEl = document.getElementById("exercise-name");
//   const exerciseDescEl = document.getElementById("exercise-description");
//   const exerciseImageEl = document.getElementById("exercise-image");
//   const customAlert = document.getElementById("custom-alert");
//   const closeAlertBtn = document.getElementById("close-alert");

//   // Get parameters from URL
//   const urlParams = new URLSearchParams(window.location.search);
//   const exerciseName = decodeURIComponent(
//     urlParams.get("exercise") || "Exercise"
//   );
//   const exerciseDesc = decodeURIComponent(
//     urlParams.get("desc") || "Let's get moving!"
//   );
//   const exerciseImage = decodeURIComponent(
//     urlParams.get("image") || "images/workout/default-exercise.png"
//   );

//   // Handle time parameter conversion
//   let exerciseTime = parseFloat(urlParams.get("time")) || 1800; // Default 30 minutes

//   // Conversion logic:
//   // - If value is < 1 (like 0.1), assume it's in minutes and convert to seconds
//   // - If value is >= 1, assume it's already in seconds
//   if (exerciseTime < 1) {
//     exerciseTime = Math.round(exerciseTime * 60); // Convert minutes to seconds
//   } else {
//     exerciseTime = Math.round(exerciseTime); // Ensure whole number of seconds
//   }

//   // Timer State
//   let timeLeft = exerciseTime;
//   let timerInterval;
//   let isPaused = false;
//   let isRunning = false;

//   // Format seconds into HH:MM:SS
//   function formatTime(seconds) {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return [
//       h.toString().padStart(2, "0"),
//       m.toString().padStart(2, "0"),
//       s.toString().padStart(2, "0"),
//     ].join(":");
//   }

//   function updateDisplay() {
//     timerDisplay.textContent = formatTime(timeLeft);

//     if (timeLeft <= 10) {
//       timerDisplay.classList.add("text-danger", "blink");
//     } else {
//       timerDisplay.classList.remove("text-danger", "blink");
//     }
//   }

//   function startTimer() {
//     if (isRunning) return;

//     isRunning = true;
//     startBtn.style.display = "none";
//     pauseBtn.style.display = "inline-block";
//     resetBtn.style.display = "inline-block";

//     clearInterval(timerInterval);
//     isPaused = false;

//     timerInterval = setInterval(() => {
//       if (!isPaused) {
//         timeLeft--;
//         updateDisplay();

//         if (timeLeft <= 0) {
//           clearInterval(timerInterval);
//           document.getElementById("exercise-done-name").textContent =
//             exerciseName;
//           customAlert.style.display = "flex";
//           resetTimer();
//         }
//       }
//     }, 1000);
//   }

//   function pauseTimer() {
//     isPaused = !isPaused;
//     pauseBtn.textContent = isPaused ? "Resume" : "Pause";
//     timerDisplay.classList.toggle("text-warning", isPaused);
//   }

//   function resetTimer() {
//     clearInterval(timerInterval);
//     timeLeft = exerciseTime;
//     isRunning = false;
//     isPaused = false;
//     updateDisplay();
//     startBtn.style.display = "inline-block";
//     pauseBtn.style.display = "none";
//     resetBtn.style.display = "none";
//     pauseBtn.textContent = "Pause";
//     timerDisplay.classList.remove("text-danger", "text-warning", "blink");
//   }

//   // Initialize display
//   exerciseNameEl.textContent = exerciseName;
//   exerciseDescEl.textContent = exerciseDesc;
//   if (exerciseImageEl) {
//     exerciseImageEl.src = exerciseImage;
//     exerciseImageEl.alt = exerciseName;
//   }

//   if (closeAlertBtn) {
//     closeAlertBtn.addEventListener("click", function () {
//       customAlert.style.display = "none";
//     });
//   }

//   updateDisplay();

//   // Event Listeners
//   startBtn.addEventListener("click", startTimer);
//   pauseBtn.addEventListener("click", pauseTimer);
//   resetBtn.addEventListener("click", resetTimer);

//   // Keyboard shortcuts
//   document.addEventListener("keydown", function (e) {
//     if (e.code === "Space") {
//       e.preventDefault();
//       isRunning ? pauseTimer() : startTimer();
//     } else if (e.code === "KeyR") {
//       resetTimer();
//     }
//   });
// });




// document.addEventListener("DOMContentLoaded", function () {
//   // DOM Elements
//   const timerDisplay = document.getElementById("timer");
//   const startBtn = document.getElementById("startBtn");
//   const pauseBtn = document.getElementById("pauseBtn");
//   const resetBtn = document.getElementById("resetBtn");
//   const exerciseNameEl = document.getElementById("exercise-name");
//   const exerciseDescEl = document.getElementById("exercise-description");
//   const exerciseImageEl = document.getElementById("exercise-image");
//   const customAlert = document.getElementById("custom-alert");
//   const closeAlertBtn = document.getElementById("close-alert");

//   // Exercise Data from URL
//   const urlParams = new URLSearchParams(window.location.search);
//   const exerciseName = decodeURIComponent(
//     urlParams.get("exercise") || "Exercise"
//   );
//   const exerciseDesc = decodeURIComponent(
//     urlParams.get("desc") || "Let's get moving!"
//   );
//   const exerciseTime = parseInt(urlParams.get("time")) || 1800; // Default: 30 minutes (1800 seconds)
//   const exerciseImage = decodeURIComponent(
//     urlParams.get("image") || "images/workout/default-exercise.png"
//   );

//   // Timer State
//   let timeLeft = exerciseTime;
//   let timerInterval;
//   let isPaused = false;
//   let isRunning = false;

//   // Format seconds into HH:MM:SS
//   function formatTime(seconds) {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return [
//       h.toString().padStart(2, "0"),
//       m.toString().padStart(2, "0"),
//       s.toString().padStart(2, "0"),
//     ].join(":");
//   }

//   function updateDisplay() {
//     timerDisplay.textContent = formatTime(timeLeft);
//     // Removed all visual alert classes
//   }

//   function startTimer() {
//     if (isRunning) return;

//     isRunning = true;
//     startBtn.style.display = "none";
//     pauseBtn.style.display = "inline-block";
//     resetBtn.style.display = "inline-block";

//     clearInterval(timerInterval);
//     isPaused = false;

//     timerInterval = setInterval(() => {
//       if (!isPaused) {
//         timeLeft--;
//         updateDisplay();

//         if (timeLeft <= 0) {
//           clearInterval(timerInterval);
//           document.getElementById("exercise-done-name").textContent =
//             exerciseName;
//           customAlert.style.display = "flex";
//           resetTimer();
//         }
//       }
//     }, 1000);
//   }

//   function pauseTimer() {
//     isPaused = !isPaused;
//     pauseBtn.textContent = isPaused ? "Resume" : "Pause";
//     // Removed visual feedback when paused
//   }

//   function resetTimer() {
//     clearInterval(timerInterval);
//     timeLeft = exerciseTime;
//     isRunning = false;
//     isPaused = false;
//     updateDisplay();
//     startBtn.style.display = "inline-block";
//     pauseBtn.style.display = "none";
//     resetBtn.style.display = "none";
//     pauseBtn.textContent = "Pause";
//   }

//   // Initialize display
//   exerciseNameEl.textContent = exerciseName;
//   exerciseDescEl.textContent = exerciseDesc;
//   if (exerciseImageEl) {
//     exerciseImageEl.src = exerciseImage;
//     exerciseImageEl.alt = exerciseName;
//   }

//   if (closeAlertBtn) {
//     closeAlertBtn.addEventListener("click", function () {
//       customAlert.style.display = "none";
//     });
//   }

//   updateDisplay();

//   // Event Listeners
//   startBtn.addEventListener("click", startTimer);
//   pauseBtn.addEventListener("click", pauseTimer);
//   resetBtn.addEventListener("click", resetTimer);

//   // Keyboard shortcuts
//   document.addEventListener("keydown", function (e) {
//     if (e.code === "Space") {
//       e.preventDefault();
//       if (isRunning) {
//         pauseTimer();
//       } else {
//         startTimer();
//       }
//     } else if (e.code === "KeyR") {
//       resetTimer();
//     }
//   });
// });


