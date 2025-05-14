// Filter meals
$(document).ready(function () {
  function filterMeals() {
    const query = $("#meal-search").val().toLowerCase().trim();
    const filter = $(".controls .buttons.active").data("filter");

    $(".image-container .box").each(function () {
      const $box = $(this);
      const title = $box.find(".link").text().toLowerCase();
      const matchesSearch = title.indexOf(query) > -1;
      const matchesCategory = filter === "all" || $box.hasClass(filter);

      if (matchesSearch && matchesCategory) {
        $box.show();
      } else {
        $box.hide();
      }
    });
  }

  // when a category button is clicked
  $(".controls .buttons").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    filterMeals();
  });

  // when typing in the search bar
  $("#meal-search").on("input", filterMeals);
});

// Meal data (ingredients + steps)
const mealData = {
  // Breakfast
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

function getMealDescription(mealId) {
  const box = document.querySelector(`[data-id="${mealId}"]`);
  if (box) return box.querySelector("p")?.textContent || "";
  return "";
}

function getMealCalories(mealId) {
  const box = document.querySelector(`[data-id="${mealId}"]`);
  if (box) return box.querySelector("h6")?.textContent || "";
  return "";
}

// Modal functionality
function initModal() {
  const modal = document.getElementById("foodModal");
  if (!modal) return;

  const modalTitle = document.getElementById("modalTitle");
  const modalImage = document.getElementById("modalImage");
  const modalIngredients = document.getElementById("modalIngredients");
  const modalSteps = document.getElementById("modalSteps");
  const closeBtn = document.querySelector(".close");

  // Attach click events to all meal links
  document.addEventListener("click", function (e) {
    if (e.target.closest(".content .link")) {
      e.preventDefault();
      const link = e.target.closest(".content .link");
      const mealName = link.textContent;
      const meal = mealData[mealName];

      if (meal) {
        modalTitle.textContent = mealName;
        modalImage.src = meal.image;

        // Populate ingredients
        modalIngredients.innerHTML = "";
        meal.ingredients.forEach((ing) => {
          const li = document.createElement("li");
          li.textContent = ing;
          modalIngredients.appendChild(li);
        });

        // Populate steps
        modalSteps.innerHTML = "";
        meal.steps.forEach((step) => {
          const li = document.createElement("li");
          li.textContent = step;
          modalSteps.appendChild(li);
        });

        // Show modal
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
      }
    }
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  });

  // Close when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
}

function initFavorites() {
  document.querySelectorAll(".fa-heart").forEach((icon) => {
    icon.addEventListener("click", function (e) {
      e.preventDefault();
      const box = this.closest(".box");
      const mealId = box.getAttribute("data-id");
      const note = document.querySelector(".notification");

      const isFav = localStorage.getItem("fav_" + mealId);
      if (isFav) {
        localStorage.removeItem("fav_" + mealId);
        this.parentElement.classList.remove("active");

        // Show removal notification
        if (note) {
          note.textContent = "Meal removed successfully!";
          note.classList.add("show");
          setTimeout(() => note.classList.remove("show"), 2000);
        }

        // Reload the list after removing
        if (document.getElementById("favorites-container")) {
          loadFavoriteMeals();
        }
      } else {
        localStorage.setItem("fav_" + mealId, "true");
        this.parentElement.classList.add("active");

        // Show added notification
        if (note) {
          note.textContent = "Favourite meal added successfully!";
          note.classList.add("show");
          setTimeout(() => note.classList.remove("show"), 2000);
        }
      }
    });

    // Persist red icon for favorites on reload
    const box = icon.closest(".box");
    const mealId = box.getAttribute("data-id");
    if (localStorage.getItem("fav_" + mealId)) {
      icon.parentElement.classList.add("active");
    }
  });
}

function loadFavoriteMeals() {
  const container = document.getElementById("favorites-container");
  if (!container) return;

  container.innerHTML = "";

  const favorites = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("fav_")) {
      const mealId = key.slice(4);
      if (mealData[mealId]) {
        favorites.push(mealId);
      }
    }
  }

  if (favorites.length === 0) {
    container.innerHTML =
      '<p class="no-favorites">You haven\'t added any favorite meals yet.</p>';
    return;
  }

  favorites.forEach((mealId) => {
    const meal = mealData[mealId];
    const box = document.createElement("div");
    box.className = `box ${meal.category}`;
    box.setAttribute("data-id", mealId);

    box.innerHTML = `
    <div class="image">
      <img src="${meal.image}" alt="${mealId}">
    </div>
    <div class="content">
      <a href="#" class="link">${mealId}</a>
      <p>${meal.description}</p>
      <div class="calories-favorite">
        <h6>${meal.calories}</h6>
        <div class="icon"><a href="#" class="active"><i class="fas fa-heart"></i></a></div>
      </div>
    </div>`;

    container.appendChild(box);
  });

  // Calculate total calories
  let totalCalories = 0;

  favorites.forEach((mealId) => {
    const meal = mealData[mealId];

    // Extract number from calorie string
    const cal = parseInt(meal.calories);
    if (!isNaN(cal)) totalCalories += cal;
  });

  // Display total
  const calDisplay = document.getElementById("total-calories");
  if (calDisplay) {
    calDisplay.textContent = `Calorie Count for Today’s Meals: ${totalCalories} calories`;
  }

  initModal();
  initFavorites();
}

// Favourite Meal
document.addEventListener("DOMContentLoaded", function () {
  // Initialize filtering
  $(".buttons").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    var filter = $(this).attr("data-filter");

    if (filter == "all") {
      $(".nutrition-diet .box").show(400);
    } else {
      $(".nutrition-diet .box")
        .not("." + filter)
        .hide(200);
      $(".nutrition-diet .box")
        .filter("." + filter)
        .show(400);
    }
  });

  initModal();
  initFavorites();

  // Load favorites on favorites page
  if (document.getElementById("favorites-container")) {
    loadFavoriteMeals();
  }
});

// Remove all
const removeBtn = document.getElementById("remove-all-favourites");
if (removeBtn) {
  removeBtn.addEventListener("click", () => {
    // Remove all favourites from localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("fav_")) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Reload favourite list
    loadFavoriteMeals();

    // Show notification
    const note = document.querySelector(".notification");
    if (note) {
      note.textContent = "All favourite meals have been removed!";
      note.classList.add("show");
      setTimeout(() => note.classList.remove("show"), 2000);
    }
  });
}

// Smooth scrolling for navigation buttons
document.querySelectorAll(".scroll-nav-buttons a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Show/hide buttons based on scroll position
window.addEventListener("scroll", function () {
  const scrollButtons = document.querySelector(".scroll-nav-buttons");
  if (!scrollButtons) return;

  const scrollPosition = window.scrollY || window.pageYOffset;
  const windowHeight = window.innerHeight;
  const documentHeight = document.body.scrollHeight;

  scrollButtons.style.display = "flex";
});

// Back to Top Button
const backToTopButton = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    // Show button after scrolling 300px
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
