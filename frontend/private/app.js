document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav_links");
  const logoutButton = document.querySelector(".logout");

  hamburger.addEventListener("click", function () {
    navLinks.classList.toggle("nav_active");
    logoutButton.classList.toggle("nav_active");

    //Close menu when clicking outside
    document.addEventListener("click", function closeMenu(e) {
      if (!e.target.closest("header")) {
        navLinks.classList.remove("nav_active");
        logoutButton.classList.remove("nav_active");
        document.removeEventListener("click", closeMenu);
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Get current page URL
  const currentPageUrl =
    window.location.pathname.split("/").pop() || "index.html";

  // Remove .html extension for comparison
  const currentPage = currentPageUrl.replace(".html", "");

  // Find all nav links
  const navLinks = document.querySelectorAll(".nav_links li a");

  // Add active class to matching link
  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href").replace(".html", "");
    if (
      linkPage === currentPage ||
      (currentPage === "index" && linkPage === "")
    ) {
      link.classList.add("active");
    }
  });


  // Handle registration form submission
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      const usernameInput = document.getElementById("username");
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");
      const confirmPasswordInput = document.getElementById("confirmPassword");

      const username = usernameInput.value;
      const email = emailInput.value;
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*+]).{8,}$/;
      const usernameRegex = /^[a-zA-Z0-9._-]+$/;
      const minLength = 3;
      const maxLength = 20;

      let isFormValid = true;

      if (!usernameRegex.test(username)) {
        alert("Username can only contain letters, numbers, periods (.), underscores (_), and hyphens (-).");
        isFormValid = false;
      } else if (username.length < minLength) {
        alert(`Username must be at least ${minLength} characters long.`);
        isFormValid = false;
      } else if (username.length > maxLength) {
        alert(`Username cannot be longer than ${maxLength} characters.`);
        isFormValid = false;
      } else if (/\s/.test(username)) {
        alert("Username cannot contain whitespace.");
        isFormValid = false;
      }

      if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character (!@#$%^&*+).");
        isFormValid = false;
      } else if (password !== confirmPassword) {
        alert("Passwords do not match.");
        isFormValid = false;
      }


      if (isFormValid) {
        fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
        })
          .then(response => {
            if (!response.ok) {
              // Handle errors:  Parse JSON for error message
              return response.json().then(errorData => {
                throw new Error(errorData.message || 'Registration failed');
              });
            }
            // If response is ok, parse the JSON.
            return response.json();
          })
          .then(data => {
            alert(data.message || "User registered successfully! Please log in.");
            window.location.href = 'login.html';
          })
          .catch(error => {
            console.error('Error during registration:', error);
            alert(error.message || 'Registration failed. Please try again later.');
          });
      }

    });
  }
});

// Navigation highlighting
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname.toLowerCase();

  if (path.includes("workout") || path.includes("timer")) {
    document.getElementById("nav-workout")?.classList.add("active");
  } else if (path.includes("index")) {
    document.getElementById("nav-home")?.classList.add("active");
  } else if (path.includes("contact")) {
    document.getElementById("nav-contact")?.classList.add("active");
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  const togglePasswordButtons = document.querySelectorAll(".password-toggle");

  // Password toggle
  togglePasswordButtons.forEach((toggleButton, index) => {
    toggleButton.addEventListener("click", function () {
      const passwordInput = passwordInputs[index];
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      toggleButton.classList.toggle("bi-eye-fill");
      toggleButton.classList.toggle("bi-eye-slash-fill");
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const username = loginForm.username.value.trim();
      const password = loginForm.password.value.trim();
      const remember = document.getElementById('remember')?.checked || false;

      if (!username || !password) {
        alert('Please enter both username and password.');
        return;
      }

      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for receiving cookies
        body: JSON.stringify({ username, password, remember }), // Send remember flag
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(data => {
              throw new Error(data.message || 'Login failed');
            });
          }
          return response.json();
        })
        .then(data => {
          alert(data.message);

          if (remember) {
            localStorage.setItem('rememberedUsername', username);
            localStorage.setItem('rememberedPassword', password);
          } else {
            localStorage.removeItem('rememberedUsername');
            localStorage.removeItem('rememberedPassword');

          }

    window.location.href = '/private/index.html';
        })
        .catch(error => {
          alert(error.message);
        });
    });


    const rememberedUsername = localStorage.getItem('rememberedUsername');
    const rememberedPassword = localStorage.getItem('rememberedPassword');

    if (rememberedUsername && rememberedPassword) {
      loginForm.username.value = rememberedUsername;
    loginForm.password.value = rememberedPassword;
    document.getElementById('remember').checked = true;
    }
  }
});
