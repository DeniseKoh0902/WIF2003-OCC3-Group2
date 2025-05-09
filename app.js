document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav_links");
  const logoutButton = document.querySelector(".logout");

  hamburger.addEventListener("click", function () {
    navLinks.classList.toggle("nav_active");
    logoutButton.classList.toggle("nav_active");

    // Optional: Close menu when clicking outside
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
  
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("passwordInput");

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
      const isHidden = passwordInput.type === "password";

      passwordInput.type = isHidden ? "text" : "password";

      // Optional: display actual password value when revealed
      if (isHidden) {
        passwordInput.value = "abcdefg";
      }

      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
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

  // Password and Username validation
  const form = document.querySelector("form");
  form.addEventListener("submit", function (event) {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*+]).{8,}$/;
    const usernameInput = document.getElementById("username");
    let isUsernameValid = true;
    const minLength = 3; // Add your minimum length here, assuming 3 for example
    const maxLength = 20;

    if (usernameInput) {
      const username = usernameInput.value;
      const usernameRegex = /^[a-zA-Z0-9._-]+$/;

      if (!usernameRegex.test(username)) {
        event.preventDefault();
        alert(
          "Username can only contain letters, numbers, periods (.), underscores (_), and hyphens (-)."
        );
        isUsernameValid = false;
      } else if (username.length < minLength) {
        event.preventDefault();
        alert(`Username must be at least ${minLength} characters long.`);
        isUsernameValid = false;
      } else if (username.length > maxLength) {
        event.preventDefault();
        alert(`Username cannot be longer than ${maxLength} characters.`);
        isUsernameValid = false;
      } else if (/\s/.test(username)) {
        event.preventDefault();
        alert("Username cannot contain whitespace.");
        isUsernameValid = false;
      }
    }

    if (isUsernameValid) {
      if (!passwordRegex.test(password)) {
        event.preventDefault();
        alert(
          "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character (!@#$%^&*+)."
        );
      } else if (password !== confirmPassword) {
        event.preventDefault();
        alert("Passwords do not match.");
      }
    }
  });
});

