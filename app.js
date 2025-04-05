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
});