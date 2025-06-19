document.addEventListener("DOMContentLoaded", function () {
  const historyContainer = document.getElementById("workout-history");
  const userId = localStorage.getItem("userId"); // Get user ID from localStorage

  if (!userId) {
    historyContainer.innerHTML = `
      <div class="text-center text-muted mt-5">
        <h4 style="color: white;">Please login to view your workout history</h4>
      </div>
    `;
    return;
  }

  fetchWorkoutHistory(userId);
});

async function fetchWorkoutHistory(userId) {
  try {
    // Correct endpoint to match your route
    const response = await fetch(`/api/workout-history/user/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const history = await response.json();

    if (!history || history.length === 0) {
      displayNoHistoryMessage();
      return;
    }

    displayWorkoutHistory(history);
  } catch (error) {
    console.error("Error fetching workout history:", error);
    displayNoHistoryMessage();
  }
}

async function displayWorkoutHistory(historyItems) {
  const historyContainer = document.getElementById("workout-history");
  historyContainer.innerHTML = "";

  for (const item of historyItems) {
    let workoutDetails = {};
    let isPlan = false;

    if (item.workout_id) {
      workoutDetails = await fetchWorkoutDetails(item.workout_id);
    } else if (item.plan_id) {
      workoutDetails = await fetchPlanDetails(item.plan_id);
      isPlan = true;
    }

    const card = document.createElement("div");
    card.className = "workout-card d-flex align-items-start mb-3 p-3";

    const workoutDate = new Date(item.workout_date);
    const formattedDate = workoutDate.toLocaleString();

    if (isPlan) {
      // For plans - no image
      const planName = workoutDetails?.plan_name || "Completed Workout Plan";
      const planDesc = workoutDetails?.plan_description || "You completed a workout plan session";
    
      card.innerHTML = `
        <div class="flex-grow-1">
          <h4 style="color: white;">${planName}</h4>
          <p>${planDesc}</p>
          <p><strong>Duration:</strong> ${item.duration} seconds</p>
          <p><strong>Calories:</strong> ${item.calories_burned} kcal</p>
          <p><strong>Date & Time:</strong> ${formattedDate}</p>
        </div>
      `;
    } else {
      // For individual workouts - with image
      card.innerHTML = `
        <img src="${
          workoutDetails.workout_pic || "images/default-workout.png"
        }" 
             alt="${workoutDetails.workout_name} Icon" 
             style="width:80px; height:auto; margin-right:15px;">
        <div class="flex-grow-1">
          <h4 style="color: white;">${workoutDetails.workout_name}</h4>
          <p>${workoutDetails.workout_description}</p>
          <p><strong>Duration:</strong> ${item.duration} seconds</p>
          <p><strong>Calories:</strong> ${item.calories_burned} kcal</p>
          <p><strong>Date & Time:</strong> ${formattedDate}</p>
        </div>
      `;
    }

    historyContainer.appendChild(card);
  }
}

async function fetchPlanDetails(planObjectId) {
  try {
    const response = await fetch(
      `/api/workout-plans/by-object-id/${planObjectId}`
    );

    if (!response.ok) {
      throw new Error("Plan not found");
    }

    const data = await response.json();

    // Debugging log - remove after testing
    console.log("Plan details response:", data);

    return data;
  } catch (error) {
    console.error("Error fetching plan details:", error);
    return {
      plan_name: "Completed Workout Plan",
      plan_description: "You completed a workout plan session",
    };
  }
}

async function fetchWorkoutDetails(workoutId) {
  try {
    const response = await fetch(`/api/workouts/${workoutId}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching workout details:", error);
    return {
      workout_name: "Unknown Workout",
      workout_description: "No description available",
      workout_pic: "images/default-workout.png",
    };
  }
}

function displayNoHistoryMessage() {
  const historyContainer = document.getElementById("workout-history");
  historyContainer.innerHTML = `
    <div class="text-center text-muted mt-5">
      <h4 style="color: white;">No workout history yet 💤</h4>
      <p>Start a workout and it will appear here.</p>
    </div>
  `;
}
