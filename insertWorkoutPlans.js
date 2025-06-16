const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://admin:admin@progress.hgkftwq.mongodb.net/crud";
const client = new MongoClient(uri);

const workoutplans = {
    fullbody: {
      name: "Full Body Workout",
      description: "Burn fat and build strength from head to toe",
      calories: "120 kcal",
      steps: [
        { name: "Squats", duration: "30s", order: 1 },
        { name: "Wall Push-Ups", duration: "30s", order: 2 },
        { name: "Plank", duration: "20s", order: 3 },
        { name: "Claps Over Head", duration: "30s", order: 4 },
      ],
    },
    abs: {
      name: "Abs Workout",
      description: "Flatten your belly with quick and easy ab moves",
      calories: "80 kcal",
      steps: [
        { name: "Crunches", duration: "30s", order: 1 },
        { name: "Leg Raises", duration: "30s", order: 2 },
        { name: "Plank Hold", duration: "20s", order: 3 },
      ],
    },
    leg: {
      name: "Leg Workout",
      description: "Quick and simple exercises to tone your legs",
      calories: "90 kcal",
      steps: [
        { name: "Lunges", duration: "30s", order: 1 },
        { name: "Wall Sit", duration: "30s", order: 2 },
        { name: "Leg Raises", duration: "30s", order: 3 },
      ],
    },
    butt: {
      name: "Butt Workout",
      description: "Build a stronger butt with simple daily moves",
      calories: "85 kcal",
      steps: [
        { name: "Glute Bridges", duration: "30s", order: 1 },
        { name: "Donkey Kicks", duration: "30s", order: 2 },
        { name: "Fire Hydrants", duration: "30s", order: 3 },
      ],
    },
  };

  
  async function insertWorkoutPlans() {
    let connection;
    try {
      // 1. Connect with timeout
      connection = await client.connect();
      await client.db("admin").command({ ping: 1 });
      console.log("Connected successfully to server");

      const collection = client.db("crud").collection("WorkoutPlans");

      // 2. Create indexes for faster queries
      await collection.createIndex({ plan_id: 1 }, { unique: true });
      await collection.createIndex({ plan_name: 1 }, { unique: true });

      // 3. Check for existing data
      const existingCount = await collection.countDocuments();
      if (existingCount > 0) {
        console.log("Data already exists, skipping insertion");
        return;
      }

      // 4. Your insertion logic (unchanged)
      const plansToInsert = Object.entries(workoutplans).map(
        ([planName, data], index) => ({
          plan_id: index + 1,
          plan_name: planName,
          plan_description: data.description,
          calories_burned: data.calories,
          steps: data.steps.map((step, stepIndex) => ({
            step_id: stepIndex + 1,
            step_name: step.name,
            step_order: step.order,
            step_duration: step.duration,
          })),
        })
      );

      const result = await collection.insertMany(plansToInsert);
      console.log(`${result.insertedCount} workout plans inserted`);
    } catch (error) {
      console.error("Error in insertWorkoutPlans:", error);
      throw error; // Re-throw to ensure catch() block gets it
    } finally {
      if (connection) {
        await client.close();
      }
    }
  }

  // Execute with better error handling
  insertWorkoutPlans()
    .then(() => console.log("Operation completed successfully"))
    .catch((err) => {
      console.error("Fatal error:", err);
      process.exit(1);
    });