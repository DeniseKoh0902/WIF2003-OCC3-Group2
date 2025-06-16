document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function (event) {
      event.preventDefault();
      try {
        const response = await fetch('/logout', {
          method: 'POST',
          credentials: 'include'
        });

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error("Failed to parse JSON from logout response:", jsonError);
          data = { message: "Unexpected response from server." };
        }

        if (response.ok) {
          alert(data.message || 'Logged out successfully');
          window.location.href = '/mainpage.html';
        } else {
          alert(data.message || 'Logout failed');
        }
      } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout.');
      }
    });
  }
});
