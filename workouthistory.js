//for testing
// TEMP: Insert mock workout data into localStorage for testing
// if (!localStorage.getItem("workoutHistory")) {
//   const sampleWorkouts = [
//     {
//       name: "Jogging",
//       category: "Aerobic",
//       image: "images/workout/manual-workout-category/aerobic/jogging.png",
//       duration: 0.1,
//       calories: 300,
//       description:
//         "Jogging on a treadmill improves cardiovascular health and endurance.",
//       datetime: "2025-05-03 18:20",
//     },
//     {
//       name: "Cycling",
//       category: "Aerobic",
//       image: "images/workout/manual-workout-category/aerobic/cycling.avif",
//       duration: 45,
//       calories: 400,
//       description:
//         "Cycling is a low-impact aerobic exercise that improves cardiovascular health, strengthens leg muscles, and enhances joint mobility. It’s great for endurance and weight management, whether done outdoors or on a stationary bike.",
//       datetime: "2025-05-03 18:20",
//     },
//   ];
//   localStorage.setItem("workoutHistory", JSON.stringify(sampleWorkouts));
// }

// ✅ 2. Then run your rendering code as usual
// Make sure the rest of your code (the DOMContentLoaded listener that renders the workout cards) comes after this block.

// ✅ 3. To reset and test again
// Open browser dev tools > Application > Local Storage > clear the workoutHistory key to re-trigger the mock insert.



// function saveWorkoutToHistory(workout) {
//   const existingHistory =
//     JSON.parse(localStorage.getItem("workoutHistory")) || [];

//   // Add current datetime
//   const now = new Date();
//   const formattedDate = now.toLocaleString("en-GB"); // e.g., "03/05/2025, 18:20:00"

//   const workoutEntry = {
//     ...workout,
//     datetime: formattedDate,
//   };

//   existingHistory.push(workoutEntry);
//   localStorage.setItem("workoutHistory", JSON.stringify(existingHistory));
// }

// // Example usage
// saveWorkoutToHistory({
//   name: "Abs Workout",
//   description: "Flatten your belly with quick and easy ab moves",
//   icon: "./images/workout/workout-plans-category/abs.png",
//   duration: "15 min",
//   calories: "100 kcal",
// });

document.addEventListener("DOMContentLoaded", function () {
  const historyContainer = document.getElementById("workout-history");

  const workoutHistory =
    JSON.parse(localStorage.getItem("workoutHistory")) || [];

  if (workoutHistory.length === 0) {
    historyContainer.innerHTML = `
            <div class="text-center text-muted mt-5">
                <h4 style="color: white;">No workout history yet 💤</h4>
                <p>Start a workout and it will appear here.</p>
            </div>
        `;
  } else {
    workoutHistory.reverse().forEach((workout) => {
      const card = document.createElement("div");
      card.className = "workout-card d-flex align-items-start mb-3 p-3";
      card.innerHTML = `
                <img src="${workout.image}" alt="${workout.name} Icon" style="width:80px; height:auto; margin-right:15px;">
                <div>
                    <h4 style="color: white;">${workout.name}</h4>
                    <p>${workout.description}</p>
                    <p><strong>Duration:</strong> ${workout.duration}</p>
                    <p><strong>Calories:</strong> ${workout.calories}</p>
                    <p><strong>Date & Time:</strong> ${workout.datetime}</p>
                </div>
            `;
      historyContainer.appendChild(card);
    });
  }
});
