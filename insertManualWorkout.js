const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://admin:admin@progress.hgkftwq.mongodb.net/crud";
const client = new MongoClient(uri);

const manualWorkoutData = {
  Jogging: {
    description:
      "Jogging on a treadmill improves cardiovascular health and endurance.",
    category: "Aerobic",
    calories: 300,
    duration: "45 minutes",
    image: "images/workout/manual-workout-category/aerobic/jogging.png",
    youtube: "https://www.youtube.com/watch?v=ZTBRQ5MEJsE",
  },
  Cycling: {
    description:
      "Cycling is a low-impact aerobic exercise that improves cardiovascular health, strengthens leg muscles, and enhances joint mobility. It's great for endurance and weight management, whether done outdoors or on a stationary bike.",
    category: "Aerobic",
    calories: 400,
    duration: "45 minutes",
    image: "images/workout/manual-workout-category/aerobic/cycling.avif",
    youtube: "https://www.youtube.com/watch?v=4ssLDk1eX9w",
  },
  Swimming: {
    description:
      "Swimming is a full-body workout that builds strength, flexibility, and stamina. It's easy on the joints and especially beneficial for cardiovascular fitness, making it ideal for all ages and fitness levels.",
    category: "Aerobic",
    calories: 250,
    duration: "30 minutes",
    image: "images/workout/manual-workout-category/aerobic/swimming.avif",
    youtube: "https://www.youtube.com/watch?v=VNdUONyi2hU",
  },
  Dancing: {
    description:
      "Dancing combines fun and fitness, helping to improve coordination, balance, and heart health. It also serves as a great stress reliever while burning calories through rhythmic body movement.",
    category: "Aerobic",
    calories: 400,
    duration: "45 minutes",
    image: "images/workout/manual-workout-category/aerobic/dancing.avif",
    youtube: "https://www.youtube.com/watch?v=ujREEgxEP7g",
  },
  "Jump Rope": {
    description:
      "Jump rope is a high-intensity cardio workout that enhances agility, coordination, and endurance. Just a few minutes can burn a lot of calories, making it a time-efficient option for overall fitness.",
    category: "Aerobic",
    calories: 200,
    duration: "15 minutes",
    image: "images/workout/manual-workout-category/aerobic/jump_rope.avif",
    youtube: "https://www.youtube.com/watch?v=u3zgHI8QnqE",
  },
  Hiking: {
    description:
      "Hiking involves walking through natural terrain, promoting both physical and mental well-being. It strengthens muscles, improves balance, and boosts mood through exposure to nature and fresh air",
    category: "Aerobic",
    calories: 350,
    duration: "60 minutes",
    image: "images/workout/manual-workout-category/aerobic/hiking.avif",
    youtube: "https://www.youtube.com/watch?v=aIIAi4L8qbs",
  },
  "Elliptical training": {
    description:
      "Elliptical training offers a low-impact, full-body cardiovascular workout. It mimics walking or running while reducing stress on joints, and often includes both upper and lower body movement for enhanced calorie burn.",
    category: "Aerobic",
    calories: 300,
    duration: "30 minutes",
    image:
      "images/workout/manual-workout-category/aerobic/elliptical_training.avif",
    youtube: "http://youtube.com/watch?v=EesEvYohy5o&t=33s",
  },
  Yoga: {
    description:
      "Yoga focuses on flexibility, balance, and mental calmness through a combination of poses, breathing techniques, and meditation. It enhances strength, relieves stress, and improves overall well-being.",
    category: "Flexibility",
    calories: 150,
    duration: "30 minutes",
    image: "images/workout/manual-workout-category/flexibility/yoga.avif",
    youtube: "https://www.youtube.com/watch?v=yPK7ISPEu3M",
  },
  Pilates: {
    description:
      "Pilates is a low-impact exercise emphasizing core strength, posture, flexibility, and muscle control. It's especially useful for improving stability and body awareness through controlled movements.",
    category: "Flexibility",
    calories: 200,
    duration: "40 minutes",
    image: "images/workout/manual-workout-category/flexibility/pilates.avif",
    youtube: "https://www.youtube.com/watch?v=zbK-HgqWClA",
  },
  "Side Lunges": {
    description:
      "Side lunges target the inner and outer thighs, glutes, and quads. They enhance lower body strength, balance, and hip flexibility, making them excellent for building lateral movement control.",
    category: "Flexibility",
    calories: 50,
    duration: "10 minutes",
    image: "images/workout/manual-workout-category/flexibility/side_lunge.jpg",
    youtube: "https://www.youtube.com/watch?v=rvqLVxYqEvo",
  },
  "Seated Hamstring Stretch": {
    description:
      "This stretch improves hamstring flexibility and reduces the risk of injury. It's performed while sitting, extending one leg out, and reaching toward the toes to gently stretch the back of the thigh.",
    category: "Flexibility",
    calories: 30,
    duration: "10 minutes",
    image:
      "images/workout/manual-workout-category/flexibility/seated_hamstring_stretch.jpg",
    youtube: "https://www.youtube.com/watch?v=D8dJ9K7SIiE",
  },
  "Cat-Cow Stretch": {
    description:
      "The cat-cow stretch is a yoga sequence that improves spine flexibility and posture. It involves arching and rounding the back to gently warm up the spine and relieve tension.",
    category: "Flexibility",
    calories: 25,
    duration: "10 minutes",
    image:
      "images/workout/manual-workout-category/flexibility/cat_cow_stretch.jpeg",
    youtube: "https://www.youtube.com/watch?v=vuyUwtHl694",
  },
  "Chest Opener Stretch": {
    description:
      "This stretch helps counteract slouched posture by opening up the chest and shoulders. It promotes better breathing, posture, and upper body flexibility, especially for those who sit long hours.",
    category: "Flexibility",
    calories: 25,
    duration: "10 minutes",
    image:
      "images/workout/manual-workout-category/flexibility/chest_opener_stretch.jpg",
    youtube: "https://www.youtube.com/watch?v=eo5x2Zw9110",
  },
  "Tai Chi": {
    description:
      "A gentle, flowing exercise that improves balance, coordination, and mental calmness through slow, controlled movements.",
    category: "Balance",
    calories: 120,
    duration: "30 minutes",
    image: "images/workout/manual-workout-category/balance/tai_chi.avif",
    youtube: "https://www.youtube.com/watch?v=-CJf7bVR2qs",
  },
  "Standing on One Foot": {
    description:
      "A simple balance drill that strengthens stabilizer muscles and enhances coordination and ankle stability.",
    category: "Balance",
    calories: 30,
    duration: "10 minutes",
    image:
      "images/workout/manual-workout-category/balance/standing_on_one_foot.jpg",
    youtube: "https://www.youtube.com/watch?v=ZLxyh_PEstI",
  },
  "Stability Ball Exercises": {
    description:
      "A variety of core-focused workouts using a stability ball to improve balance, posture, and core strength.",
    category: "Balance",
    calories: 150,
    duration: "30 minutes",
    image:
      "images/workout/manual-workout-category/balance/stability_ball_exercises.avif",
    youtube: "https://www.youtube.com/watch?v=5WP4F_AEUPE",
  },
  "Bird Dog Exercises": {
    description:
      "A core and stability move performed on hands and knees, extending opposite arm and leg to enhance coordination and spine alignment.",
    category: "Balance",
    calories: 80,
    duration: "15 minutes",
    image:
      "images/workout/manual-workout-category/balance/bird_dog_exercises.jpg",
    youtube: "https://www.youtube.com/watch?v=HtMI17DGuTk",
  },
  "Flamingo Stand": {
    description:
      "A single-leg balance exercise that strengthens the lower body and challenges your core and proprioception.",
    category: "Balance",
    calories: 40,
    duration: "15 minutes",
    image: "images/workout/manual-workout-category/balance/flamingo_stand.jpg",
    youtube: "https://www.youtube.com/watch?v=MOo8c39aZZI",
  },
  "Circuit Training": {
    description:
      "A fast-paced workout that cycles through different exercises with minimal rest, improving strength, endurance, and cardiovascular health.",
    category: "HIIT",
    calories: 300,
    duration: "30 minutes",
    image: "images/workout/manual-workout-category/hiit/circuit_training.jpg",
    youtube: "https://www.youtube.com/watch?v=kTJ5b0RkKX8",
  },
  Burpees: {
    description:
      "A full-body high-intensity move combining a squat, jump, and push-up to build strength and endurance.",
    category: "HIIT",
    calories: 150,
    duration: "10 minutes",
    image: "images/workout/manual-workout-category/hiit/burpees.jpg",
    youtube: "https://www.youtube.com/watch?v=818SkLAPyKY",
  },
  "Mountain Climbers": {
    description:
      "A cardio-core exercise involving quick knee drives in a plank position, boosting heart rate and strengthening abs and legs.",
    category: "HIIT",
    calories: 120,
    duration: "15 minutes",
    image: "images/workout/manual-workout-category/hiit/mountain_climbers.jpg",
    youtube: "https://www.youtube.com/watch?v=kLh-uczlPLg",
  },
  "High Knees": {
    description:
      "A high-intensity cardio exercise where you run in place, lifting your knees toward your chest to engage core and legs.",
    category: "HIIT",
    calories: 100,
    duration: "10 minutes",
    image: "images/workout/manual-workout-category/hiit/high_knees.jpg",
    youtube: "https://www.youtube.com/watch?v=ZNDHivUg7vA",
  },
  "Jump Squats": {
    description:
      "A plyometric move combining a squat and jump to develop explosive power in the lower body.",
    category: "HIIT",
    calories: 120,
    duration: "15 minutes",
    image: "images/workout/manual-workout-category/hiit/jump_squats.jpg",
    youtube: "https://www.youtube.com/watch?v=5xv0DKqe5XQ",
  },
  "Skater Jumps": {
    description:
      "A lateral jumping move mimicking ice skating that improves agility, leg strength, and coordination.",
    category: "HIIT",
    calories: 90,
    duration: "10 minutes",
    image: "images/workout/manual-workout-category/hiit/skater_jumps.jpg",
    youtube: "https://www.youtube.com/watch?v=CaN4zfIPyXU",
  },
  "Push-Ups": {
    description:
      "A bodyweight exercise that strengthens the chest, shoulders, triceps, and core with each controlled lowering and push movement.",
    category: "Strength",
    calories: 100,
    duration: "15 minutes",
    image: "images/workout/manual-workout-category/strength/push_ups.avif",
    youtube: "https://www.youtube.com/watch?v=WDIpL0pjun0",
  },
  "Pull-Ups": {
    description:
      "An upper body strength move where you lift your body by pulling up on a bar, working the back, arms, and shoulders.",
    category: "Strength",
    calories: 80,
    duration: "10 minutes",
    image: "images/workout/manual-workout-category/strength/pull_ups.avif",
    youtube: "https://www.youtube.com/watch?v=aAggnpPyR6E",
  },
  Squats: {
    description:
      "A fundamental leg exercise that targets quads, hamstrings, glutes, and core while improving lower body strength.",
    category: "Strength",
    calories: 100,
    duration: "20 minutes",
    image: "images/workout/manual-workout-category/strength/squats.avif",
    youtube: "https://www.youtube.com/watch?v=xqvCmoLULNY",
  },
  Deadlifts: {
    description:
      "A strength-building movement that works the back, glutes, hamstrings, and grip by lifting weights from the ground.",
    category: "Strength",
    calories: 150,
    duration: "30 minutes",
    image: "images/workout/manual-workout-category/strength/deadlifts.avif",
    youtube: "https://www.youtube.com/watch?v=JNpUNRPQkAk",
  },
  "Sit-Ups": {
    description:
      "An abdominal exercise where you lift your upper body from a lying position to strengthen core muscles.",
    category: "Strength",
    calories: 100,
    duration: "15 minutes",
    image: "images/workout/manual-workout-category/strength/sit_ups.jpg",
    youtube: "https://www.youtube.com/watch?v=pCX65Mtc_Kk",
  },
  "Bicycle Crunch": {
    description:
      "A dynamic core exercise mimicking a pedaling motion to target the abs and obliques with a twisting movement.",
    category: "Strength",
    calories: 120,
    duration: "15 minutes",
    image: "images/workout/manual-workout-category/strength/bicycle_crunch.jpg",
    youtube: "https://www.youtube.com/watch?v=cbKIDZ_XyjY",
  },
  Plank: {
    description:
      "A static core hold performed in a push-up-like position, focusing on core endurance and body alignment.",
    category: "Strength",
    calories: 50,
    duration: "10 minutes",
    image: "images/workout/manual-workout-category/strength/plank.jpg",
    youtube: "https://www.youtube.com/watch?v=pvIjsG5Svck",
  },
};

// Convert to array of documents
const manualworkout = Object.entries(manualWorkoutData).map(
  ([name, data], index) => ({
    workout_id: index + 1,
    workout_name: name,
    workout_description: data.description,
    workout_category: data.category,
    calories_burned: data.calories,
    workout_duration: data.duration,
    workout_pic: data.image,
    youtube: data.youtube,
  })
);

async function insertManualWorkout() {
  try {
    await client.connect();
    const database = client.db("crud");
    const collection = database.collection("ManualWorkout");

    const result = await collection.insertMany(manualworkout);
    console.log(`${result.insertedCount} manualworkout inserted.`);
  } finally {
    await client.close();
  }
}

insertManualWorkout().catch(console.dir);
