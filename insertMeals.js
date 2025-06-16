const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://admin:admin@progress.hgkftwq.mongodb.net/crud";
const client = new MongoClient(uri);

const mealData = {
  "½ cup oatmeal with walnuts and blueberries": {
    category: "breakfast",
    image: "images/nutrition/meals/breakfast1.png",
    description:
      "A hearty and nutritious breakfast made with ½ cup of oatmeal topped with crunchy walnuts and sweet blueberries.",
    calories: "301 calories",
    ingredients: [
      "1/2 cup rolled oats",
      "1/4 cup walnuts",
      "1/2 cup blueberries",
      "1 cup milk or water",
    ],
    steps: [
      "Cook oats with milk/water until creamy.",
      "Top with walnuts and blueberries.",
    ],
  },
  
  "1 cup Greek yogurt with blueberries": {
    category: "breakfast",
    image: "images/nutrition/meals/breakfast2.png",
    description:
      "Creamy Greek yogurt topped with sweet, juicy blueberries — a simple, healthy, and satisfying start to your day.",
    calories: "233 calories",
    ingredients: ["1 cup Greek yogurt", "1/2 cup blueberries"],
    steps: ["Scoop yogurt into a bowl.", "Top with blueberries."],
  },

  "Omelet with veggie and whole wheat toast": {
    category: "breakfast",
    image: "images/nutrition/meals/breakfast3.png",
    description:
      "A nutritious breakfast featuring a fluffy omelet loaded with fresh veggies, paired with a slice of whole wheat toast.",
    calories: "533 calories",
    ingredients: [
      "2 eggs",
      "2 tablespoons milk",
      "1/8 teaspoon salt",
      "1/8 teaspoon black pepper",
      "Mixed veggies",
      "1 teaspoon olive oil or butter",
      "1 slice whole wheat bread",
    ],
    steps: [
      "Beat eggs with milk, salt, and pepper.",
      "Heat oil in a pan for 2 minutes.",
      "Pour in the egg mixture and cook until set.",
      "Fold the omelet and cook for another 30 seconds.",
      "Toast the bread.",
      "Serve hot.",
    ],
  },

  "Protein pancake with strawberries and bananas": {
    category: "breakfast",
    image: "images/nutrition/meals/breakfast4.png",
    description:
      "Fluffy protein pancakes topped with fresh strawberries and bananas —  a delicious and energizing breakfast.",
    calories: "342 calories",
    ingredients: [
      "1/2 cup oats",
      "1/2 scoop protein powder",
      "1/4 cup egg whites",
      "1/4 cup milk",
      "1/2 teaspoon baking powder",
      "1/2 banana, sliced",
      "1/4 cup strawberries, sliced",
      "1 tablespoon honey",
      "1 teaspoon oil or butter",
    ],
    steps: [
      "Blend oats, protein powder, egg whites, milk, and baking powder.",
      "Cook pancakes in a pan with oil or butter.",
      "Top with banana and strawberries.",
      "Serve and enjoy!",
    ],
  },

  "2 cup of strawberry sweet banana smoothie": {
    category: "breakfast",
    image: "images/nutrition/meals/breakfast5.png",
    description:
      "A refreshing breakfast with two cups of smoothie made with sweet strawberries and ripe bananas.",
    calories: "643 calories",
    ingredients: [
      "1 cup strawberries, hulled",
      "1 ripe banana",
      "1/2 cup yogurt",
      "1/2 cup ice",
    ],
    steps: [
      "Blend strawberries, banana, yogurt, honey, and ice until smooth.",
      "Pour into glass and serve chilled.",
    ],
  },

  "Greek yogurt bowl": {
    category: "breakfast",
    image: "images/nutrition/meals/breakfast6.png",
    description:
      "A wholesome and satisfying bowl of creamy Greek yogurt topped with fresh fruits and crunchy nuts for a naturally nutritious and refreshing breakfast.",
    calories: "397 calories",
    ingredients: [
      "1 bowl Greek yogurt",
      "1/4 cup fresh fruits",
      "2 tablespoon mixed nuts",
    ],
    steps: ["Add yogurt to a bowl.", "Top with fruits and nuts."],
  },

  // Lunch
  "Chicken pasta salad": {
    category: "lunch",
    image: "images/nutrition/meals/lunch1.png",
    description:
      "A light and hearty lunch featuring tender chicken tossed with pasta, crisp vegetables, and a flavorful dressing for a refreshing and satisfying meal.",
    calories: "394 calories",
    ingredients: [
      "1 cup cooked chicken",
      "1 cup cooked pasta",
      "1/2 cup diced cucumber",
      "1/4 cup red onion, thinly sliced",
      "1/4 cup olive oil",
      "1 tablespoon lemon juice",
      "1/4 teaspoon salt",
      "1/8 teaspoon black pepper",
    ],
    steps: [
      "Combine chicken, pasta, cucumber, and onion in a bowl.",
      "Whisk together olive oil, lemon juice, salt, and pepper.",
      "Toss the pasta with the dressing.",
    ],
  },

  "Mediterranean chicken salad": {
    category: "lunch",
    image: "images/nutrition/meals/lunch2.png",
    description:
      "A vibrant lunch made with juicy grilled chicken, crisp greens, cucumbers, tomatoes, and olives, all tossed in a zesty Mediterranean dressing.",
    calories: "305 calories",
    ingredients: [
      "1 cup grilled chicken (sliced)",
      "2 cups mixed greens (lettuce, spinach)",
      "1/2 cup cucumber, sliced",
      "1/2 cup cherry tomatoes, halved",
      "1/4 cup olives",
      "2 tablespoons olive oil",
      "1 tablespoon lemon juice",
      "1 teaspoon dried oregano",
      "1/4 teaspoon salt",
      "1/8 teaspoon black pepper",
    ],
    steps: [
      "Combine chicken, mixed greens, cucumber, tomatoes, and olives in a bowl.",
      "Whisk together olive oil, lemon juice, oregano, salt, and pepper.",
      "Toss the salad with the dressing.",
    ],
  },

  "Grilled chicken sandwich": {
    category: "lunch",
    image: "images/nutrition/meals/lunch3.png",
    description:
      "A hearty and flavorful lunch with tender grilled chicken layered in a soft sandwich bun, paired with crisp lettuce and juicy tomatoes.",
    calories: "406 calories",
    ingredients: [
      "1 grilled chicken breast",
      "2 toast breads",
      "2 leaves lettuce",
      "1 tablespoon mayonnaise/mustard",
    ],
    steps: [
      "Layer the grilled chicken on the bottom half of the bread.",
      "Add lettuces.",
      "Spread mayonnaise or mustard.",
      "Top with the other bread.",
    ],
  },

  "Waldorf chicken wrap": {
    category: "lunch",
    image: "images/nutrition/meals/lunch4.png",
    description:
      "A delicious wrap filled with tender chicken, crisp apples, grapes, and crunchy walnuts, all tossed in a creamy dressing for a satisfying lunch.",
    calories: "333 calories",
    ingredients: [
      "1 tortilla wrap",
      "1 cup cooked chicken (diced)",
      "1/2 apple (diced)",
      "1/4 cup grapes (halved)",
      "2 tablespoon walnuts",
      "2 tablespoon mayonnaise",
      "1/4 teaspoon salt",
      "1/8 teaspoon black pepper",
    ],
    steps: [
      "Mix chicken, apple, grapes, walnuts, yogurt, salt, and pepper.",
      "Place the mixture in the center of the wrap.",
      "Fold and roll up the wrap.",
    ],
  },

  "Turkey sandwich": {
    category: "lunch",
    image: "images/nutrition/meals/lunch5.png",
    description:
      "A classic and satisfying lunch with lean turkey slices layered between fresh bread, crisp lettuce, ripe tomatoes, and a touch of mustard.",
    calories: "382 calories",
    ingredients: [
      "2 slices of bread",
      "4-6 slices of lean turkey",
      "2 leaves lettuce",
      "2 slices tomato",
      "1 tablespoon mustard",
      "1/4 teaspoon salt",
      "1/8 teaspoon black pepper",
    ],
    steps: [
      "Spread mustard on one slice of bread.",
      "Layer turkey, lettuce, and tomato on the bread.",
      "Season with salt and pepper.",
      "Top with the other slice of bread.",
    ],
  },

  "Teriyaki salmon bowl": {
    category: "lunch",
    image: "images/nutrition/meals/lunch6.png",
    description:
      "A flavorful and satisfying lunch featuring tender teriyaki-glazed salmon served over a bed of steamed rice, paired with crisp sautéed vegetables.",
    calories: "535 calories",
    ingredients: [
      "1 salmon fillet",
      "2 tablespoon teriyaki sauce",
      "1 cup cooked rice",
      "1/2 cup mixed vegetables",
    ],
    steps: [
      "Cook salmon with teriyaki sauce.",
      "Cook vegetables.",
      "Serve salmon and veggies over rice.",
    ],
  },

  "High protein bento lunch box": {
    category: "lunch",
    image: "images/nutrition/meals/lunch7.png",
    description:
      "A simple and hearty high-protein bento lunch box with grilled chicken, fresh veggies, and steamed rice, providing a balanced and energizing meal.",
    calories: "591 calories",
    ingredients: [
      "1 grilled chicken breast",
      "1/2 cup steamed rice",
      "1/2 cup mixed fresh veggies",
      "Soy sauce or dressing (optional)",
    ],
    steps: [
      "Grill the chicken and slice it.",
      "Steam the rice.",
      "Add fresh veggies to the box.",
      "Pack all into a lunch box.",
    ],
  },

  "Salmon salad wrap": {
    category: "lunch",
    image: "images/nutrition/meals/lunch8.png",
    description:
      "A light and tasty lunch featuring fresh salmon, crisp veggies, and a tangy dressing, all wrapped in a soft tortilla for a healthy and satisfying meal.",
    calories: "558 calories",
    ingredients: [
      "1 cooked salmon fillet (flaked)",
      "1 tortilla wrap/buns",
      "1/4 cup shredded lettuce",
      "1/4 teaspoon salt",
      "1/8 teaspoon black pepper",
    ],
    steps: [
      "Mix salmon with salt, and pepper.",
      "Add lettuce.",
      "Place mixture on the tortilla/between buns and wrap it up.",
    ],
  },

  // Dinner
  "Beef enchiladas": {
    category: "dinner",
    image: "images/nutrition/meals/dinner1.png",
    description:
      "A flavorful dinner featuring tender beef wrapped in soft tortillas, smothered in rich enchilada sauce, and baked to perfection with melted cheese.",
    calories: "422 calories",
    ingredients: [
      "200g ground beef",
      "4 small tortillas",
      "1/2 cups enchilada sauce",
      "1/2 cups shredded cheese",
      "1/4 cup diced onion",
      "1/4 teaspoon salt",
      "1/8 teaspoon black pepper",
    ],
    steps: [
      "Cook beef with onion, salt, and pepper.",
      "Fill tortillas with beef, roll them up, and place in a baking dish.",
      "Pour enchilada sauce on top and sprinkle with cheese.",
      "Bake at 180°C (350°F) for 15–20 minutes.",
      "Serve warm.",
    ],
  },

  "Hummus and veggies": {
    category: "dinner",
    image: "images/nutrition/meals/dinner2.png",
    description:
      "A light and healthy dinner featuring creamy hummus paired with a variety of fresh, crunchy vegetables for a refreshing and satisfying meal.",
    calories: "129 calories",
    ingredients: [
      "1/2 cup hummus",
      "1/2 cup carrot sticks",
      "1/2 cup cucumber slices",
      "1/4 cup bell pepper strips",
    ],
    steps: [
      "Wash and slice all vegetables.",
      "Arrange veggies on a plate with hummus in the center.",
      "Dip and enjoy!",
    ],
  },

  "2 shrimp tacos": {
    category: "dinner",
    image: "images/nutrition/meals/dinner3.png",
    description:
      "A delicious dinner with two soft tacos filled with tender shrimp, crisp veggies, and a zesty sauce, offering a light yet flavorful meal.",
    calories: "301 calories",
    ingredients: [
      "8–10 small shrimp (peeled and deveined)",
      "2 small soft tortillas",
      "1/4 cup shredded lettuce or cabbage",
      "1 tablespoon sour cream or yogurt",
      "1 tablespoon lime juice",
      "1/4 teaspoon salt",
      "1/8 teaspoon black pepper",
    ],
    steps: [
      "Season shrimp with salt and pepper, then cook in a pan until pink.",
      "Mix sour cream with lime juice for the sauce.",
      "Warm tortillas, fill with shrimp, lettuce, and drizzle sauce.",
    ],
  },

  "Turkey sweet potato chili": {
    category: "dinner",
    image: "images/nutrition/meals/dinner4.png",
    description:
      "A comforting dinner featuring lean turkey and tender sweet potatoes simmered in a flavorful chili, creating a hearty and nutritious meal.",
    calories: "613 calories",
    ingredients: [
      "200g ground turkey",
      "1 medium sweet potato (peeled & diced)",
      "1/4 cup chopped onion",
      "1 tablespoon sour cream or yogurt",
      "1/2 tablespoon chili powder",
      "1 cup water/broth",
      "1/4 teaspoon salt",
      "1/8 teaspoon black pepper",
    ],
    steps: [
      "Cook onion and turkey until browned.",
      "Add sweet potato, tomatoes, chili powder, salt, pepper, and water.",
      "Simmer for 20–25 minutes until sweet potatoes are tender.",
    ],
  },

  "Burrito bowl": {
    category: "dinner",
    image: "images/nutrition/meals/dinner5.png",
    description:
      "A satisfying dinner featuring a hearty mix of rice, seasoned meat, beans, veggies, and your choice of toppings, all perfectly combined for a flavorful meal.",
    calories: "591 calories",
    ingredients: [
      "1/2 cup cooked rice",
      "100g cooked seasoned chicken or beef",
      "1/4 cup black beans (rinsed)",
      "1/4 cup corn kernels",
      "1/4 cup chopped tomatoes",
      "1 tbsp sour cream or yogurt",
      "1/4 teaspoon salt",
      "1/8 teaspoon black pepper",
    ],
    steps: [
      "In a bowl, layer rice, meat, beans, corn, and tomatoes.",
      "Add sour cream on top and season with salt and pepper.",
      "Mix gently.",
    ],
  },
};

// Convert to array of documents
const meals = Object.entries(mealData).map(([name, data], index) => ({
  nutrition_id: index + 1,
  food_name: name,
  food_description: data.description,
  food_image: data.image,
  calories: data.calories,
  meal_type: data.category,
  ingredients: data.ingredients,
  steps: data.steps,
}));

async function insertMeals() {
  try {
    await client.connect();
    const database = client.db("crud");
    const collection = database.collection("NutritionFood");

    const result = await collection.insertMany(meals);
    console.log(`${result.insertedCount} meals inserted.`);
  } finally {
    await client.close();
  }
}

insertMeals().catch(console.dir);
