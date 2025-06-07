let mealData = {};
let userFavorites = [];
let currentUserId = null;

async function initializeApp() {
  try {
    // Clear previous data
    mealData = {};
    userFavorites = [];
    currentUserId = null;
    
    await fetchCurrentUser();
    
    if (!currentUserId) {
      console.log("No user logged in");
      renderMeals();
      return;
    }
    
    await Promise.all([fetchMealData(), fetchUserFavorites()]);
    
    renderMeals();
    loadFavoriteMeals();
    initModal();
    initFavorites();
    setupMealFilters();
  } catch (err) {
    console.error("Initialization error:", err);
  }
}

// Fetch current user data
async function fetchCurrentUser() {
  try {
    const response = await fetch("/api/current-user", {
      method: "GET",
      credentials: "include"
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    
    const userData = await response.json();
    currentUserId = userData._id;
    console.log("Current user ID:", currentUserId);
  } catch (err) {
    console.error("Error fetching user data:", err);
    throw err;
  }
}

$(document).ready(function () {
  initializeApp();
});

function getNutritionIdFromMealId(mealId) {
  // Loop through mealData to find the nutrition_id
  for (const [name, meal] of Object.entries(mealData)) {
    if (name === mealId) {
      return meal.nutrition_id || 1;
    }
  }
  return null;
}

// Fetch meal data from API
async function fetchMealData() {
  try {
    const res = await fetch("/api/meals");
    const data = await res.json();

    mealData = {};
    data.forEach((meal) => {
      mealData[meal.food_name] = {
        nutrition_id: meal.nutrition_id,
        category: meal.meal_type,
        image: meal.food_image,
        description: meal.food_description,
        calories: meal.calories,
        ingredients: meal.ingredients,
        steps: meal.steps,
      };
    });
  } catch (err) {
    console.error("Failed to fetch meals:", err);
    throw err;
  }
}


async function fetchUserFavorites() {
  if (!currentUserId) {
    console.error("No current user ID available");
    return;
  }

  try {
    const response = await fetch(`/api/favorites?user_id=${currentUserId}`, {
      method: "GET",
      credentials: "include"
    });
    
    if (!response.ok) throw new Error("Failed to fetch favorites");
    
    userFavorites = await response.json();
    console.log("Favorites loaded:", userFavorites.length);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    userFavorites = [];
    throw err;
  }
}

// Render meals on the page
function renderMeals() {
  const container = document.getElementById("meal-container");
  container.innerHTML = ""; // Clear existing content

  Object.entries(mealData).forEach(([mealName, meal]) => {
    const box = document.createElement("div");
    box.className = `box ${meal.category}`;
    box.setAttribute("data-id", mealName);

    const isFavorited = currentUserId && userFavorites.some(fav => 
      fav.nutrition_id === meal.nutrition_id && 
      fav.user_id === currentUserId
    );
    const heartClass = isFavorited ? "fas fa-heart active" : "fas fa-heart";

    box.innerHTML = `
      <div class="image">
        <img src="${meal.image}" alt="${mealName}">
      </div>
      <div class="content">
        <a href="#" class="link">${mealName}</a>
        <p>${meal.description}</p>
        <div class="calories-favorite">
          <h6>${meal.calories}</h6>
          <div class="icon"><a href="#"><i class="${heartClass}"></i></a></div>
        </div>
      </div>
    `;

    container.appendChild(box);
  });

  initFavorites();
}

function handleLogout() {
  // Clear all user-specific data
  currentUserId = null;
  userFavorites = [];
  
  initializeApp();
}

document.getElementById('logout-button')?.addEventListener('click', handleLogout);

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

// Initialize favorite heart icon toggle functionality
function initFavorites() {
  document.removeEventListener("click", handleFavoriteClick);
  document.addEventListener("click", handleFavoriteClick);
}

async function handleFavoriteClick(e) {
  try {
    const heartIcon = e.target.closest(".fa-heart");
    const heartLink = e.target.closest(".icon a");
    const clickTarget = heartIcon || heartLink;
    
    if (!clickTarget) return;

    e.preventDefault();
    e.stopPropagation();

    const icon = heartIcon || heartLink?.querySelector(".fa-heart");
    if (!icon) return;

    const box = icon.closest(".box");
    if (!box) return;

    const mealId = box.getAttribute("data-id");
    if (!mealId) {
      console.error("No data-id found on box element");
      return;
    }

    const nutritionId = getNutritionIdFromMealId(mealId);
    const isOnFavoritesPage = window.location.pathname.includes("favouritemeals.html");

    if (!currentUserId) {
      showNotification("Please log in to manage favorites", true);
      return;
    }

    const existingFavorite = userFavorites?.find(
      fav => fav?.nutrition_id && String(fav.nutrition_id) === String(nutritionId)
    ) || null;

    if (icon.classList) {
      icon.classList.replace("fa-heart", "fa-spinner");
      icon.classList.add("fa-spin");
    }

    // Handle deletion
    if (existingFavorite) {
      const response = await fetch(`/api/favorites/${existingFavorite._id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message || "Failed to delete favorite");
      }

      // Update state
      userFavorites = userFavorites?.filter(fav => fav?._id !== existingFavorite._id) || [];

      // Update UI 
      if (document.body.contains(box)) {
        if (isOnFavoritesPage) {
          box.style.transition = "opacity 0.3s";
          box.style.opacity = "0";
          setTimeout(() => {
          box.remove();
          updateTotalCalories();
          }, 300);
          
          if (userFavorites.length === 0) {
            const container = document.getElementById("favorites-container");
            if (container) {
              container.innerHTML = `
                <div class="empty-state">
                  <i class="fas fa-heart-broken"></i>
                  <p>No favorites found</p>
                </div>`;
            }
          }
        } else if (icon.classList) {
          icon.classList.remove("active");
        }
      }
      
      showNotification("Favorite removed successfully!");
    } 
    // Handle adding new favorite
    else if (!isOnFavoritesPage) {
      const response = await fetch("/api/favorites", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nutrition_id: nutritionId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message || "Failed to add favorite");
      }

      const newFavorite = await response.json();
      userFavorites = [...(userFavorites || []), newFavorite];
      
      if (icon.classList) {
        icon.classList.add("active");
      }
      showNotification("Added to favorites!");
    }
  } catch (error) {
    console.error("Favorite operation failed:", error);
    showNotification(error?.message || "An error occurred", true);
  } finally {
    // Safely reset icon state
    try {
      const icon = e.target.closest(".fa-heart") || 
                   e.target.closest(".icon a")?.querySelector(".fa-heart");
      if (icon?.classList) {
        icon.classList.replace("fa-spinner", "fa-heart");
        icon.classList.remove("fa-fast-spin");
      }
    } catch (finalError) {
      console.error("Error cleaning up:", finalError);
    }
  }
}

document.addEventListener("click", function(e) {
  // Only handle clicks that originated from heart elements
  if (e.target.closest(".fa-heart, .icon a")) {
    handleFavoriteClick(e).catch(console.error);
  }
});

// Helper function to update total calories display
function updateTotalCalories() {
  const container = document.getElementById("favorites-container");
  if (!container) return;

  let totalCalories = 0;
  container.querySelectorAll('.box').forEach(box => {
    const caloriesText = box.querySelector('h6')?.textContent;
    if (caloriesText) {
      const calories = parseInt(caloriesText);
      if (!isNaN(calories)) totalCalories += calories;
    }
  });

  const calDisplay = document.getElementById("total-calories");
  if (calDisplay) {
    calDisplay.textContent = `Calorie Count for Today's Meals: ${totalCalories} calories`;
  }
}

// Load and display favorite meals
function loadFavoriteMeals() {
  const container = document.getElementById("favorites-container");
  if (!container) return;

  fetch("/api/favorites", {
    method: "GET",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((favorites) => {
      container.innerHTML = "";

      if (favorites.length === 0) {
        container.innerHTML =
          '<p class="no-favorites">You haven\'t added any favorite meals yet.</p>';
        return;
      }

      let totalCalories = 0;

      favorites.forEach((fav) => {
        const meal = Object.values(mealData).find(
          (m) => m.nutrition_id === fav.nutrition_id
        );
        const mealId = Object.keys(mealData).find(
          (key) => mealData[key].nutrition_id === fav.nutrition_id
        );

        if (meal) {
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
                <div class="icon"><a href="#" class="active"><i class="fas fa-heart active"></i></a></div>
              </div>
            </div>`;

          container.appendChild(box);

          const cal = parseInt(meal.calories);
          if (!isNaN(cal)) totalCalories += cal;
        }
      });

      const calDisplay = document.getElementById("total-calories");
      if (calDisplay) {
        calDisplay.textContent = `Calorie Count for Today’s Meals: ${totalCalories} calories`;
      }

      initModal();
      initFavorites();
    })
    .catch((err) => {
      console.error("Error loading favorite meals:", err);
      container.innerHTML = '<p class="error">Failed to load favorite meals.</p>';
    });
}


// Filter meals based on search and category
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

document.addEventListener("DOMContentLoaded", function () {
  fetchMealData();

  $(".buttons").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    const filter = $(this).attr("data-filter");

    if (filter === "all") {
      $(".nutrition-diet .box").show(400);
    } else {
      $(".nutrition-diet .box").not("." + filter).hide(200);
      $(".nutrition-diet .box").filter("." + filter).show(400);
    }
  });
});

async function getIsMealFavorited(nutritionId) {
  try {
    const response = await fetch("/api/favorites", {
      method: "GET",
      credentials: "include"
    });
    const favorites = await response.json();
    return favorites.some(fav => fav.nutrition_id === nutritionId);
  } catch (err) {
    console.error("Error checking favorite status:", err);
    return false;
  }
}

function showNotification(message, isError = false) {
  const note = document.querySelector(".notification");
  if (!note) return;

  note.textContent = message;
  note.className = "notification show"; // Reset classes
  if (isError) {
    note.classList.add("error");
  }
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    note.classList.remove("show");
  }, 3000);
}


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

const removeBtn = document.getElementById("remove-all-favourites");

if (removeBtn) {
  removeBtn.addEventListener("click", async () => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete all favorites");
      }

      const container = document.getElementById("favorites-container");
      if (container) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-heart-broken"></i>
            <p>No favorites found</p>
          </div>`;
      }

      updateTotalCalories();

      userFavorites = [];

      const note = document.querySelector(".notification");
      if (note) {
        note.textContent = data.message || "All favorite meals have been removed!";
        note.classList.add("show");
        setTimeout(() => note.classList.remove("show"), 2000);
      }

    } catch (error) {
      console.error("Error deleting all favorites:", error);
      const note = document.querySelector(".notification");
      if (note) {
        note.textContent = error.message;
        note.classList.add("show", "error");
        setTimeout(() => note.classList.remove("show", "error"), 2000);
      }
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
