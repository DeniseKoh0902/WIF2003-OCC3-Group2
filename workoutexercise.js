const exercises = [
  {
    name: "Jogging",
    category: "Aerobic",
    image: "images/workout/manual-workout-category/aerobic/jogging.png",
    duration: 0.1,
    calories: 300,
    description:
      "Jogging on a treadmill improves cardiovascular health and endurance.",
    youtube: "https://www.youtube.com/watch?v=ZTBRQ5MEJsE",
  },
  {
    name: "Cycling",
    category: "Aerobic",
    image: "images/workout/manual-workout-category/aerobic/cycling.avif",
    duration: 45,
    calories: 400,
    description:
      "Cycling is a low-impact aerobic exercise that improves cardiovascular health, strengthens leg muscles, and enhances joint mobility. It’s great for endurance and weight management, whether done outdoors or on a stationary bike.",
    youtube: "https://www.youtube.com/watch?v=4ssLDk1eX9w",
  },
  {
    name: "Swimming",
    category: "Aerobic",
    image: "images/workout/manual-workout-category/aerobic/swimming.avif",
    duration: 30,
    calories: 250,
    description:
      "Swimming is a full-body workout that builds strength, flexibility, and stamina. It's easy on the joints and especially beneficial for cardiovascular fitness, making it ideal for all ages and fitness levels.",
    youtube: "https://www.youtube.com/watch?v=VNdUONyi2hU",
  },
  {
    name: "Dancing",
    category: "Aerobic",
    image: "images/workout/manual-workout-category/aerobic/dancing.avif",
    duration: 45,
    calories: 400,
    description:
      "Dancing combines fun and fitness, helping to improve coordination, balance, and heart health. It also serves as a great stress reliever while burning calories through rhythmic body movement.",
    youtube: "https://www.youtube.com/watch?v=ujREEgxEP7g",
  },
  {
    name: "Jump Rope",
    category: "Aerobic",
    image: "images/workout/manual-workout-category/aerobic/jump_rope.avif",
    duration: 15,
    calories: 200,
    description:
      "Jump rope is a high-intensity cardio workout that enhances agility, coordination, and endurance. Just a few minutes can burn a lot of calories, making it a time-efficient option for overall fitness.",
    youtube: "https://www.youtube.com/watch?v=u3zgHI8QnqE",
  },
  {
    name: "Hiking",
    category: "Aerobic",
    image: "images/workout/manual-workout-category/aerobic/hiking.avif",
    duration: 60,
    calories: 350,
    description:
      "Hiking involves walking through natural terrain, promoting both physical and mental well-being. It strengthens muscles, improves balance, and boosts mood through exposure to nature and fresh air",
    youtube: "https://www.youtube.com/watch?v=aIIAi4L8qbs",
  },
  {
    name: "Elliptical training",
    category: "Aerobic",
    image:
      "images/workout/manual-workout-category/aerobic/elliptical_training.avif",
    duration: 30,
    calories: 300,
    description:
      "Elliptical training offers a low-impact, full-body cardiovascular workout. It mimics walking or running while reducing stress on joints, and often includes both upper and lower body movement for enhanced calorie burn.",
    youtube: "http://youtube.com/watch?v=EesEvYohy5o&t=33s",
  },
  {
    name: "Yoga",
    category: "Flexibility",
    image: "images/workout/manual-workout-category/flexibility/yoga.avif",
    duration: 30,
    calories: 150,
    description:
      "Yoga focuses on flexibility, balance, and mental calmness through a combination of poses, breathing techniques, and meditation. It enhances strength, relieves stress, and improves overall well-being.",
    youtube: "https://www.youtube.com/watch?v=yPK7ISPEu3M",
  },
  {
    name: "Pilates",
    category: "Flexibility",
    image: "images/workout/manual-workout-category/flexibility/pilates.avif",
    duration: 40,
    calories: 200,
    description:
      "Pilates is a low-impact exercise emphasizing core strength, posture, flexibility, and muscle control. It’s especially useful for improving stability and body awareness through controlled movements.",
    youtube: "https://www.youtube.com/watch?v=zbK-HgqWClA",
  },
  {
    name: "Side Lunges",
    category: "Flexibility",
    image: "images/workout/manual-workout-category/flexibility/side_lunge.jpg",
    duration: 10,
    calories: 50,
    description:
      "Side lunges target the inner and outer thighs, glutes, and quads. They enhance lower body strength, balance, and hip flexibility, making them excellent for building lateral movement control.",
    youtube: "https://www.youtube.com/watch?v=rvqLVxYqEvo",
  },
  {
    name: "Seated Hamstring Stretch",
    category: "Flexibility",
    image:
      "images/workout/manual-workout-category/flexibility/seated_hamstring_stretch.jpg",
    duration: 10,
    calories: 30,
    description:
      "This stretch improves hamstring flexibility and reduces the risk of injury. It's performed while sitting, extending one leg out, and reaching toward the toes to gently stretch the back of the thigh.",
    youtube: "https://www.youtube.com/watch?v=D8dJ9K7SIiE",
  },
  {
    name: "Cat-Cow Stretch",
    category: "Flexibility",
    image:
      "images/workout/manual-workout-category/flexibility/cat_cow_stretch.jpeg",
    duration: 10,
    calories: 25,
    description:
      "The cat-cow stretch is a yoga sequence that improves spine flexibility and posture. It involves arching and rounding the back to gently warm up the spine and relieve tension.",
    youtube: "https://www.youtube.com/watch?v=vuyUwtHl694",
  },
  {
    name: "Chest Opener Stretch",
    category: "Flexibility",
    image:
      "images/workout/manual-workout-category/flexibility/chest_opener_stretch.jpg",
    duration: 10,
    calories: 25,
    description:
      "This stretch helps counteract slouched posture by opening up the chest and shoulders. It promotes better breathing, posture, and upper body flexibility, especially for those who sit long hours.",
    youtube: "https://www.youtube.com/watch?v=eo5x2Zw9110",
  },
  {
    name: "Tai Chi",
    category: "Balance",
    image: "images/workout/manual-workout-category/balance/tai_chi.avif",
    duration: 30,
    calories: 120,
    description:
      "A gentle, flowing exercise that improves balance, coordination, and mental calmness through slow, controlled movements.",
    youtube: "https://www.youtube.com/watch?v=-CJf7bVR2qs",
  },
  {
    name: "Standing on One Foot",
    category: "Balance",
    image:
      "images/workout/manual-workout-category/balance/standing_on_one_foot.jpg",
    duration: 10,
    calories: 30,
    description:
      "A simple balance drill that strengthens stabilizer muscles and enhances coordination and ankle stability.",
    youtube: "https://www.youtube.com/watch?v=ZLxyh_PEstI",
  },
  {
    name: "Stability Ball Exercises",
    category: "Balance",
    image:
      "images/workout/manual-workout-category/balance/stability_ball_exercises.avif",
    duration: 30,
    calories: 150,
    description:
      "A variety of core-focused workouts using a stability ball to improve balance, posture, and core strength.",
    youtube: "https://www.youtube.com/watch?v=5WP4F_AEUPE",
  },
  {
    name: "Bird Dog Exercises",
    category: "Balance",
    image:
      "images/workout/manual-workout-category/balance/bird_dog_exercises.jpg",
    duration: 15,
    calories: 80,
    description:
      "A core and stability move performed on hands and knees, extending opposite arm and leg to enhance coordination and spine alignment.",
    youtube: "https://www.youtube.com/watch?v=HtMI17DGuTk",
  },
  {
    name: "Flamingo Stand",
    category: "Balance",
    image: "images/workout/manual-workout-category/balance/flamingo_stand.jpg",
    duration: 15,
    calories: 40,
    description:
      "A single-leg balance exercise that strengthens the lower body and challenges your core and proprioception.",
    youtube: "https://www.youtube.com/watch?v=MOo8c39aZZI",
  },
  {
    name: "Circuit Training",
    category: "HIIT",
    image: "images/workout/manual-workout-category/hiit/circuit_training.jpg",
    duration: 30,
    calories: 300,
    description:
      "A fast-paced workout that cycles through different exercises with minimal rest, improving strength, endurance, and cardiovascular health.",
    youtube: "https://www.youtube.com/watch?v=kTJ5b0RkKX8",
  },
  {
    name: "Burpees",
    category: "HIIT",
    image: "images/workout/manual-workout-category/hiit/burpees.jpg",
    duration: 10,
    calories: 150,
    description:
      "A full-body high-intensity move combining a squat, jump, and push-up to build strength and endurance.",
    youtube: "https://www.youtube.com/watch?v=818SkLAPyKY",
  },
  {
    name: "Mountain Climbers",
    category: "HIIT",
    image: "images/workout/manual-workout-category/hiit/mountain_climbers.jpg",
    duration: 15,
    calories: 120,
    description:
      "A cardio-core exercise involving quick knee drives in a plank position, boosting heart rate and strengthening abs and legs.",
    youtube: "https://www.youtube.com/watch?v=kLh-uczlPLg",
  },
  {
    name: "High Knees",
    category: "HIIT",
    image: "images/workout/manual-workout-category/hiit/high_knees.jpg",
    duration: 10,
    calories: 100,
    description:
      "A high-intensity cardio exercise where you run in place, lifting your knees toward your chest to engage core and legs.",
    youtube: "https://www.youtube.com/watch?v=ZNDHivUg7vA",
  },
  {
    name: "Jump Squats",
    category: "HIIT",
    image: "images/workout/manual-workout-category/hiit/jump_squats.jpg",
    duration: 15,
    calories: 120,
    description:
      "A plyometric move combining a squat and jump to develop explosive power in the lower body.",
    youtube: "https://www.youtube.com/watch?v=5xv0DKqe5XQ",
  },
  {
    name: "Skater Jumps",
    category: "HIIT",
    image: "images/workout/manual-workout-category/hiit/skater_jumps.jpg",
    duration: 10,
    calories: 90,
    description:
      "A lateral jumping move mimicking ice skating that improves agility, leg strength, and coordination.",
    youtube: "https://www.youtube.com/watch?v=CaN4zfIPyXU",
  },
  {
    name: "Push-Ups",
    category: "Strength",
    image: "images/workout/manual-workout-category/strength/push_ups.avif",
    duration: 15,
    calories: 100,
    description:
      "A bodyweight exercise that strengthens the chest, shoulders, triceps, and core with each controlled lowering and push movement.",
    youtube: "https://www.youtube.com/watch?v=WDIpL0pjun0",
  },
  {
    name: "Pull-Ups",
    category: "Strength",
    image: "images/workout/manual-workout-category/strength/pull_ups.avif",
    duration: 10,
    calories: 80,
    description:
      "An upper body strength move where you lift your body by pulling up on a bar, working the back, arms, and shoulders.",
    youtube: "https://www.youtube.com/watch?v=aAggnpPyR6E",
  },
  {
    name: "Squats",
    category: "Strength",
    image: "images/workout/manual-workout-category/strength/squats.avif",
    duration: 20,
    calories: 100,
    description:
      "A fundamental leg exercise that targets quads, hamstrings, glutes, and core while improving lower body strength.",
    youtube: "https://www.youtube.com/watch?v=xqvCmoLULNY",
  },
  {
    name: "Deadlifts",
    category: "Strength",
    image: "images/workout/manual-workout-category/strength/deadlifts.avif",
    duration: 30,
    calories: 150,
    description:
      "A strength-building movement that works the back, glutes, hamstrings, and grip by lifting weights from the ground.",
    youtube: "https://www.youtube.com/watch?v=JNpUNRPQkAk",
  },
  {
    name: "Sit-Ups",
    category: "Strength",
    image: "images/workout/manual-workout-category/strength/sit_ups.jpg",
    duration: 15,
    calories: 100,
    description:
      "An abdominal exercise where you lift your upper body from a lying position to strengthen core muscles.",
    youtube: "https://www.youtube.com/watch?v=pCX65Mtc_Kk",
  },
  {
    name: "Bicycle Crunch",
    category: "Strength",
    image: "images/workout/manual-workout-category/strength/bicycle_crunch.jpg",
    duration: 15,
    calories: 120,
    description:
      "A dynamic core exercise mimicking a pedaling motion to target the abs and obliques with a twisting movement.",
    youtube: "https://www.youtube.com/watch?v=cbKIDZ_XyjY",
  },
  {
    name: "Plank",
    category: "Strength",
    image: "images/workout/manual-workout-category/strength/plank.jpg",
    duration: 10,
    calories: 50,
    description:
      "A static core hold performed in a push-up-like position, focusing on core endurance and body alignment.",
    youtube: "https://www.youtube.com/watch?v=pvIjsG5Svck",
  },
];

const urlParams = new URLSearchParams(window.location.search);
let category = urlParams.get("category");

// Normalize to handle cases like "All" vs "all"
if (category) category = category.toLowerCase();

// Update category title
const categoryTitle = document.getElementById("category-title");
if (categoryTitle) {
  categoryTitle.textContent =
    category && category !== "all"
      ? `${category.charAt(0).toUpperCase() + category.slice(1)} Exercises`
      : "All Exercises";
}

// Filter exercises
let filteredExercises;
if (!category || category === "all") {
  filteredExercises = exercises; // Show all
} else {
  filteredExercises = exercises.filter(
    (exercise) => exercise.category.toLowerCase() === category
  );
}

// Display exercises
const exercisesContainer = document.getElementById("exercises-container");
if (exercisesContainer && filteredExercises.length > 0) {
  filteredExercises.forEach((exercise) => {
    const exerciseCard = document.createElement("div");
    exerciseCard.classList.add("exercise-card");
    // Convert minutes to seconds for the timer
    const durationInSeconds = exercise.duration * 60;
    exerciseCard.innerHTML = `
      <div class="exercise-image" style="background-image: url('${exercise.image}')">
              <span class="exercise-category">${exercise.category}</span>
          </div>
          <div class="exercise-info">
              <h3 class="exercise-name">${exercise.name}</h3>
              <div class="exercise-details">
                  <span><i class="fas fa-clock"></i> ${exercise.duration} min</span>
                  <span><i class="fas fa-fire"></i> ${exercise.calories} cal</span>
              </div>
              <div class="exercise-actions">
                  <button class="btn btn-primary start-btn" 
                          data-name="${exercise.name}"
                          data-duration="${durationInSeconds}"  
                          data-calories="${exercise.calories}"
                          data-description="${exercise.description}">
                      Start
                  </button>
                  <button class="btn btn-secondary" onclick="showExerciseDetails('${exercise.name}', '${exercise.description}', '${exercise.youtube}')">Details</button>
              </div>
          </div>
    `;
    exercisesContainer.appendChild(exerciseCard);
  });

  // Add event listeners to all Start buttons
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("start-btn")) {
      const button = e.target;
      const exerciseName = button.getAttribute("data-name");
      const duration = button.getAttribute("data-duration");
      const calories = button.getAttribute("data-calories");
      const description = button.getAttribute("data-description");

      window.location.href = `timer.html?exercise=${encodeURIComponent(
        exerciseName
      )}&time=${duration}&calories=${calories}&desc=${encodeURIComponent(
        description
      )}`;
    }
  });
} else if (exercisesContainer) {
  exercisesContainer.innerHTML = "<p>No exercises found for this category.</p>";
}

function showExerciseDetails(name, description, youtube) {
  const message = `${name}\n\nDescription:\n${description}\n\nClick OK to open the YouTube video.`;
  if (window.confirm(message)) {
    window.open(youtube, "_blank");
  }
}


// // Function to upload exercises to MongoDB
//     async function uploadExercises() {
//       try {
//         const response = await fetch('http://localhost:3000/uploadExercises', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(exercises)
//         });

//         if (response.ok) {
//           console.log("Exercises uploaded successfully!");
//         } else {
//           console.log("Failed to upload exercises.");
//         }
//       } catch (error) {
//         console.error("Error uploading exercises:", error);
//       }
//     }

//     // Call the function to upload exercises
//     uploadExercises();