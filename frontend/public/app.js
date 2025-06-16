document.addEventListener("DOMContentLoaded", function () {
  // Hamburger menu and navigation highlighting
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav_links");
  const logoutButton = document.querySelector(".logout");

  if (hamburger && navLinks && logoutButton) {
    // Ensure elements exist before adding listeners
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("nav_active");
      logoutButton.classList.toggle("nav_active");

      //Close menu when clicking outside
      document.addEventListener("click", function closeMenu(e) {
        if (!e.target.closest("header") && !e.target.closest("#hamburger")) {
          // Added !e.target.closest("#hamburger")
          navLinks.classList.remove("nav_active");
          logoutButton.classList.remove("nav_active");
          document.removeEventListener("click", closeMenu);
        }
      });
    });
  }

  // Get current page URL for navigation highlighting
  const currentPageUrl =
    window.location.pathname.split("/").pop() || "index.html";
  const currentPage = currentPageUrl.replace(".html", "");
  const navLinksList = document.querySelectorAll(".nav_links li a"); // Renamed to avoid conflict with `navLinks` above

  navLinksList.forEach((link) => {
    const linkPage = link.getAttribute("href").replace(".html", "");
    if (
      linkPage === currentPage ||
      (currentPage === "index" && linkPage === "")
    ) {
      link.classList.add("active");
    }
  });

  // Navigation highlighting for specific sections (existing logic)
  const path = window.location.pathname.toLowerCase();
  if (path.includes("workout") || path.includes("timer")) {
    document.getElementById("nav-workout")?.classList.add("active");
  } else if (path.includes("index")) {
    document.getElementById("nav-home")?.classList.add("active");
  } else if (path.includes("contact")) {
    document.getElementById("nav-contact")?.classList.add("active");
  }

  // Password toggle for any password input
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  const togglePasswordButtons = document.querySelectorAll(".password-toggle");

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

  // --- Form Submission Handlers ---

  // Handle REGISTRATION form submission
  const registerForm = document.querySelector('form[action="/register"]'); // Target specific form if possible, or check inputs
  if (registerForm) {
    // Check if this is truly the registration form by looking for a unique ID or specific inputs
    const usernameInput = registerForm.querySelector("#username");
    const emailInput = registerForm.querySelector("#email");
    const passwordInput = registerForm.querySelector("#password");
    const confirmPasswordInput = registerForm.querySelector("#confirmPassword");

    // Only proceed if these inputs exist, indicating it's the registration form
    if (usernameInput && emailInput && passwordInput && confirmPasswordInput) {
      registerForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*+]).{8,}$/;
        const usernameRegex = /^[a-zA-Z0-9._-]+$/;
        const minLength = 3;
        const maxLength = 20;

        let isFormValid = true;

        if (!usernameRegex.test(username)) {
          window.alert(
            "Username can only contain letters, numbers, periods (.), underscores (_), and hyphens (-)."
          );
          isFormValid = false;
        } else if (username.length < minLength) {
          window.alert(
            `Username must be at least ${minLength} characters long.`
          );
          isFormValid = false;
        } else if (username.length > maxLength) {
          window.alert(
            `Username cannot be longer than ${maxLength} characters.`
          );
          isFormValid = false;
        } else if (/\s/.test(username)) {
          window.alert("Username cannot contain whitespace.");
          isFormValid = false;
        }

        if (!passwordRegex.test(password)) {
          window.alert(
            "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character (!@#$%^&*+)."
          );
          isFormValid = false;
        } else if (password !== confirmPassword) {
          window.alert("Passwords do not match.");
          isFormValid = false;
        }

        if (isFormValid) {
          fetch("/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              email,
              password,
              confirm_password: confirmPassword,
            }),
          })
            .then((response) => {
              if (!response.ok) {
                return response.json().then((errorData) => {
                  throw new Error(errorData.message || "Registration failed");
                });
              }
              return response.json();
            })
            .then((data) => {
              window.alert(
                data.message || "User registered successfully! Please log in."
              );
              window.location.href = "login.html";
            })
            .catch((error) => {
              console.error("Error during registration:", error);
              window.alert(
                error.message || "Registration failed. Please try again later."
              );
            });
        }
      });
    }
  }

  // Handle LOGIN form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const username = loginForm.username.value.trim();
      const password = loginForm.password.value.trim();
      const remember = document.getElementById("remember")?.checked || false;

      if (!username || !password) {
        window.alert("Please enter both username and password.");
        return;
      }

      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for receiving cookies
        body: JSON.stringify({ username, password, remember }), // Send remember flag
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.message || "Login failed");
            });
          }
          return response.json();
        })
        .then((data) => {
          window.alert(data.message);
          // Save user ID from server response into localStorage-by dens,dens want to use
          if (data._id) {
            localStorage.setItem("userId", data._id);
          }
          
          if (remember) {
            localStorage.setItem("rememberedUsername", username);
            localStorage.setItem("rememberedPassword", password);
          } else {
            localStorage.removeItem("rememberedUsername");
            localStorage.removeItem("rememberedPassword");
          }

          window.location.href = "/private/index.html";
        })
        .catch((error) => {
          window.alert(error.message);
        });
    });

    // Autocomplete for login form
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    const rememberedPassword = localStorage.getItem("rememberedPassword");

    if (rememberedUsername && rememberedPassword) {
      loginForm.username.value = rememberedUsername;
      loginForm.password.value = rememberedPassword;
      document.getElementById("remember").checked = true;
    }
  }

  // --- Forgot Password Page Logic ---
  const forgotPasswordForm = document.querySelector(".form-container form"); // This targets the form within .form-container
  // We add a more robust check to ensure this is indeed the forgot password form on the correct page
  if (
    forgotPasswordForm &&
    window.location.pathname.toLowerCase().endsWith("forgot.html")
  ) {
    const usernameInput = forgotPasswordForm.querySelector("#username");
    const emailInput = forgotPasswordForm.querySelector('input[name="email"]');

    // Ensure these specific inputs exist, confirming it's the forgot password form
    if (usernameInput && emailInput) {
      forgotPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = usernameInput.value;
        const email = emailInput.value;

        try {
          const response = await fetch(
            "http://localhost:3000/forgot-password",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, email }),
            }
          );

          const data = await response.json();

          if (!response.ok && data.message) {
            window.alert(data.message);
          } else {
            window.alert(
              "The link has been sent to your email. Kindly check your inbox."
            );
          }
        } catch (error) {
          console.error("Error during forgot password request:", error);
          window.alert("An unexpected error occurred. Please try again.");
        }
      });
    }
  }

  // --- Reset Password Page Logic ---
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  // This logic only runs if the element 'resetPasswordForm' exists AND the URL starts with '/reset-password'
  if (
    resetPasswordForm &&
    window.location.pathname.toLowerCase().startsWith("/reset-password")
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const id = urlParams.get("id");

    if (!token || !id) {
      window.alert(
        "Invalid or missing password reset link. Please use the link from your email."
      );
      window.location.href = "login.html";
      return;
    }

    resetPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const password = document.getElementById("newPassword").value;
      const confirmPassword =
        document.getElementById("confirmNewPassword").value;

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*+]).{8,}$/;
      if (!passwordRegex.test(password)) {
        window.alert(
          "New password must be at least 8 characters and include uppercase, lowercase, a number, and a special character (!@#$%^&*+)."
        );
        return;
      }
      if (password !== confirmPassword) {
        window.alert("New passwords do not match.");
        return;
      }

      try {
        // *** FIX APPLIED HERE: Changed /resetpassword to /reset-password ***
        const response = await fetch(
          `http://localhost:3000/reset-password?token=${token}&id=${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password, confirmPassword }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          window.alert(data.message);
          window.location.href = "login.html";
        } else {
          window.alert(
            data.message ||
              "An error occurred during password reset. Please try again."
          );
        }
      } catch (error) {
        console.error("Error during password reset:", error);
        window.alert("An unexpected error occurred. Please try again.");
      }
    });
  }
});
