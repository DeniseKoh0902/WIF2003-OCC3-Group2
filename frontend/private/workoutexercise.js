document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  let category = urlParams.get("category")?.toLowerCase() || "all";

  // DOM elements
  const categoryTitle = document.getElementById("category-title");
  const exercisesContainer = document.getElementById("exercises-container");
  const loadingIndicator = document.getElementById("loading-indicator");
  const errorContainer = document.getElementById("error-container");

  updateCategoryTitle();
  displayExercises();

  function updateCategoryTitle() {
    if (categoryTitle) {
      categoryTitle.textContent =
        category !== "all"
          ? `${category.charAt(0).toUpperCase() + category.slice(1)} Exercises`
          : "All Exercises";
    }
  }

  async function fetchExercises() {
    try {
      showLoading(true);
      let url = "/api/workouts";
      if (category !== "all") {
        url += `?category=${encodeURIComponent(category)}`;
      }

      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid data format");
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      showError(error.message);
      return [];
    } finally {
      showLoading(false);
    }
  }

  async function displayExercises() {
    if (!exercisesContainer) return;

    const exercises = await fetchExercises();
    exercisesContainer.innerHTML = exercises.length
      ? exercises.map(createExerciseCard).join("")
      : `<div class="no-exercises">
           <i class="fas fa-dumbbell"></i>
           <p>No exercises found for this category.</p>
         </div>`;

    setupEventListeners();
  }

  function createExerciseCard(exercise) {
    const durationInSeconds = parseDuration(exercise.workout_duration);

    return `
      <div class="exercise-card">
        <div class="exercise-image" style="background-image: url('${exercise.workout_pic}')">
          <span class="exercise-category">${exercise.workout_category}</span>
        </div>
        <div class="exercise-info">
          <h3 class="exercise-name">${exercise.workout_name}</h3>
          <div class="exercise-details">
            <span><i class="fas fa-clock"></i> ${exercise.workout_duration}</span>
            <span><i class="fas fa-fire"></i> ${exercise.calories_burned} cal</span>
          </div>
          <div class="exercise-actions">
            <button class="btn btn-primary start-btn" 
              data-id="${exercise.workout_id}"
              data-name="${exercise.workout_name}"
              data-duration="${durationInSeconds}"
              data-category="${exercise.workout_category}"
              data-calories="${exercise.calories_burned}"
              data-description="${exercise.workout_description}"
              data-image="${exercise.workout_pic}">
              Start
            </button>
            <button class="btn btn-secondary details-btn" 
              data-name="${exercise.workout_name}"
              data-description="${exercise.workout_description}"
              data-youtube="${exercise.youtube}">
              Details
            </button>
          </div>
        </div>
      </div>
    `;
  }

  const userId = localStorage.getItem("userId");
  function setupEventListeners() {
    document.querySelectorAll(".start-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const params = new URLSearchParams();
        params.append("exercise", button.dataset.name);
        params.append("time", button.dataset.duration);
        params.append("calories", button.dataset.calories);
        params.append("desc", button.dataset.description);
        params.append("category", button.dataset.category);
        params.append("image", button.dataset.image);
        params.append("workoutId", button.dataset.id); // This was missing
        params.append("userId", userId); 

        window.location.href = `timer.html?${params.toString()}`;
      });
    });

    document.querySelectorAll(".details-btn").forEach((button) => {
      button.addEventListener("click", () => {
        showExerciseDetails(
          button.dataset.name,
          button.dataset.description,
          button.dataset.youtube
        );
      });
    });
  }

  function parseDuration(durationStr) {
    // Handle both "X min" format and plain numbers
    const minutes = parseInt(durationStr) || 0;
    return minutes * 60; // Convert to seconds
  }

  function showExerciseDetails(name, description, youtube) {
    const message = `${name}\n\n${description}`;
    if (confirm(`${message}\n\nOpen YouTube video?`)) {
      window.open(youtube || "#", "_blank");
    }
  }

  function showLoading(show) {
    if (loadingIndicator)
      loadingIndicator.style.display = show ? "block" : "none";
  }

  function showError(message) {
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-triangle"></i>
          ${message}
          <button class="retry-btn">Try Again</button>
        </div>
      `;
      errorContainer
        .querySelector(".retry-btn")
        .addEventListener("click", displayExercises);
    }
  }
});

