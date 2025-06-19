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

// async function fetchPlanDetails(planId) {
//   try {
//     const response = await fetch(`/api/workoutPlans/${planId}`);
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching plan details:", error);
//     return {
//       plan_name: "Unknown Plan",
//       plan_description: "No description available",
//     };
//   }
// }

function displayNoHistoryMessage() {
  const historyContainer = document.getElementById("workout-history");
  historyContainer.innerHTML = `
    <div class="text-center text-muted mt-5">
      <h4 style="color: white;">No workout history yet 💤</h4>
      <p>Start a workout and it will appear here.</p>
    </div>
  `;
}


// document.addEventListener("DOMContentLoaded", function () {
//   const historyContainer = document.getElementById("workout-history");

//   const userId = localStorage.getItem("user_id");

//   if (!userId) {
//     historyContainer.innerHTML = `
//       <div class="text-center text-muted mt-5">
//         <h4 style="color: white;">User not logged in 💤</h4>
//         <p>Please log in to view workout history.</p>
//       </div>
//     `;
//     return;
//   }

//   fetch(`/api/workout-history/user/${userId}`)
//     .then((res) => res.json())
//     .then((data) => {
//       if (!data.length) {
//         historyContainer.innerHTML = `
//           <div class="text-center text-muted mt-5">
//             <h4 style="color: white;">No workout history yet 💤</h4>
//             <p>Start a workout and it will appear here.</p>
//           </div>
//         `;
//         return;
//       }

//       data.reverse().forEach((workout) => {
//         const card = document.createElement("div");
//         card.className = "workout-card d-flex align-items-start mb-3 p-3";
//         card.innerHTML = `
//           <img src="${workout.image || "/images/default-workout.png"}" alt="${
//           workout.name
//         } Icon" style="width:80px; height:auto; margin-right:15px;">
//           <div>
//             <h4 style="color: white;">${workout.name}</h4>
//             <p>${workout.description || ""}</p>
//             <p><strong>Duration:</strong> ${workout.duration}</p>
//             <p><strong>Calories:</strong> ${workout.calories_burned}</p>
//             <p><strong>Date & Time:</strong> ${new Date(
//               workout.workout_date
//             ).toLocaleString()}</p>
//           </div>
//         `;
//         historyContainer.appendChild(card);
//       });
//     })
//     .catch((err) => {
//       console.error("Fetch error:", err);
//       historyContainer.innerHTML = `
//         <div class="text-center text-muted mt-5">
//           <h4 style="color: white;">Error fetching history</h4>
//           <p>${err.message}</p>
//         </div>
//       `;
//     });
// });



// document.addEventListener("DOMContentLoaded", function () {
//   const historyContainer = document.getElementById("workout-history");

//   // Fetch workout history from server
//   fetchWorkoutHistory();

//   async function fetchWorkoutHistory() {
//     try {
//       const response = await fetch("/api/workout-history", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch workout history");
//       }

//       const workoutHistory = await response.json();
//       displayWorkoutHistory(workoutHistory);
//     } catch (error) {
//       console.error("Error fetching workout history:", error);
//       showErrorMessage();
//     }
//   }

//   function displayWorkoutHistory(workoutHistory) {
//     if (workoutHistory.length === 0) {
//       historyContainer.innerHTML = `
//         <div class="text-center text-muted mt-5">
//           <h4 style="color: white;">No workout history yet 💤</h4>
//           <p>Start a workout and it will appear here.</p>
//         </div>
//       `;
//     } else {
//       historyContainer.innerHTML = ""; // Clear container

//       workoutHistory.forEach((history) => {
//         const card = document.createElement("div");
//         card.className = "workout-card d-flex align-items-start mb-3 p-3";

//         // Format date for display
//         const workoutDate = new Date(history.workout_date);
//         const formattedDate = workoutDate.toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         });

//         card.innerHTML = `
//           <div class="workout-icon" style="width:80px; height:80px; margin-right:15px; background-color:#2c3e50; display:flex; align-items:center; justify-content:center; border-radius:8px;">
//             <i class="fas fa-dumbbell" style="font-size:2rem; color:#3498db;"></i>
//           </div>
//           <div style="flex:1">
//             <h4 style="color: white;">${
//               history.WorkoutPlan?.name || "Custom Workout"
//             }</h4>
//             <p><strong>Type:</strong> ${
//               history.ManualWorkout?.category || "N/A"
//             }</p>
//             <p><strong>Duration:</strong> ${history.duration} minutes</p>
//             <p><strong>Calories Burned:</strong> ${history.calories_burned}</p>
//             <p><strong>Date:</strong> ${formattedDate}</p>
//             <button class="btn btn-sm btn-danger delete-btn" data-id="${
//               history.history_id
//             }">Delete</button>
//           </div>
//         `;
//         historyContainer.appendChild(card);
//       });

//       // Add event listeners to delete buttons
//       document.querySelectorAll(".delete-btn").forEach((button) => {
//         button.addEventListener("click", deleteWorkoutHistory);
//       });
//     }
//   }

//   async function deleteWorkoutHistory(event) {
//     const historyId = event.target.getAttribute("data-id");

//     if (!confirm("Are you sure you want to delete this workout record?")) {
//       return;
//     }

//     try {
//       const response = await fetch(`/api/workout-history/${historyId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete workout history");
//       }

//       // Refresh the workout history display
//       fetchWorkoutHistory();
//     } catch (error) {
//       console.error("Error deleting workout history:", error);
//       alert("Failed to delete workout. Please try again.");
//     }
//   }

//   function showErrorMessage() {
//     historyContainer.innerHTML = `
//       <div class="text-center text-muted mt-5">
//         <h4 style="color: white;">Error loading workout history</h4>
//         <p>Please try again later.</p>
//       </div>
//     `;
//   }
// });

// document.addEventListener("DOMContentLoaded", async function () {
//   const historyContainer = document.getElementById("workout-history");

//   const userId = localStorage.getItem("user_id");
//   try {
//     const response = await fetch(`/api/workout-history?user_id=${userId}`);

//     if (!response.ok) throw new Error("Failed to fetch history");

//     const data = await response.json();
//     renderWorkoutHistory(data.history); // assuming your API returns { success: true, history: [...] }
//   } catch (error) {
//     console.error("Error:", error);
//     historyContainer.innerHTML = `
//       <div class="alert alert-danger">
//         Failed to load workout history. Please try again later.
//       </div>
//     `;
//   }

//   function escapeHTML(str) {
//     return str
//       ?.replace(/&/g, "&amp;")
//       .replace(/</g, "&lt;")
//       .replace(/>/g, "&gt;")
//       .replace(/"/g, "&quot;")
//       .replace(/'/g, "&#039;");
//   }

//   function renderWorkoutHistory(history) {
//     if (history.length === 0) {
//       historyContainer.innerHTML = `
//         <div class="empty-state">
//           <i class="fas fa-dumbbell"></i>
//           <h4>No workouts recorded yet</h4>
//           <p>Your completed workouts will appear here</p>
//         </div>
//       `;
//       return;
//     }
  
//     historyContainer.innerHTML = history
//       .map((item) => `
//         <div class="workout-card" data-id="${item._id}">
//           <div class="workout-image">
//             <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" onerror="this.src='/images/default-workout.png'">
//           </div>
//           <div class="workout-details">
//             <h3>${escapeHTML(item.name)}</h3>
//             <div class="workout-meta">
//               <span class="badge ${item.type}">${escapeHTML(item.category)}</span>
//               <span>${new Date(item.workout_date).toLocaleString()}</span>
//             </div>
//             <div class="workout-stats">
//               <div><i class="fas fa-clock"></i> <span>${item.duration} mins</span></div>
//               <div><i class="fas fa-fire"></i> <span>${item.calories_burned} cal</span></div>
//             </div>
//             <button class="btn-delete" data-id="${item._id}">
//               <i class="fas fa-trash"></i>
//             </button>
//           </div>
//         </div>
//       `)
//       .join("");
  
//     // Delete logic
//     document.querySelectorAll(".btn-delete").forEach((btn) => {
//       btn.addEventListener("click", async function () {
//         const id = this.getAttribute("data-id");
//         if (confirm("Delete this workout record?")) {
//           try {
//             const response = await fetch(`/api/workout-history/${id}`, {
//               method: "DELETE",
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//               },
//             });
  
//             if (response.ok) {
//               this.closest(".workout-card").remove();
//               if (!document.querySelector(".workout-card")) {
//                 renderWorkoutHistory([]);
//               }
//             } else {
//               alert("Failed to delete record.");
//             }
//           } catch (error) {
//             console.error("Delete failed:", error);
//           }
//         }
//       });
//     });
//   }
// });
