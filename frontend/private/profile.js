document.addEventListener('DOMContentLoaded', async () => {
  try {
    //password toggle
    document.querySelectorAll('.password-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = toggle.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        toggle.classList.toggle('bi-eye-slash-fill');
        toggle.classList.toggle('bi-eye-fill');
      });
    });

    //fetch user profile
    const res = await fetch("/api/profile", {
      method: "GET",
      credentials: "include"
    });
    if (!res.ok) throw new Error("User not logged in or session expired");
    const user = await res.json(); 

    // fetch daily streak
    const streakRes = await fetch('/api/profile/streak', {
      method: 'GET',
      credentials: 'include'
    });
    

    //fill in personal info
    document.getElementById('profileName').textContent = user.username;
    document.getElementById('username').value = user.username;
    document.getElementById('username').readOnly = true;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phonenumber || '';
    document.getElementById('dob').value = user.birthday ? user.birthday.split('T')[0] : '';
    document.getElementById('profilePic').src = user.profile_pic || './images/profile/profile2.png';

    if (user.workoutStats) {
      document.getElementById('workout').textContent = user.workoutStats.totalWorkouts || '0';
      document.getElementById('points').textContent = user.workoutStats.achievementPoints || '0';
    } else if (user.goals) {
      document.getElementById('workout').textContent = user.goals.totalWorkouts || '0';
      document.getElementById('points').textContent = user.goals.achievementPoints || '0';
    } else {
      document.getElementById('workout').textContent = '0';
      document.getElementById('points').textContent = '0';
    }


    if (streakRes.ok) {
      const { streak } = await streakRes.json();
      document.getElementById('streak').textContent = `${streak} day${streak !== 1 ? 's' : ''}`;
    } else {
      document.getElementById('streak').textContent = '0 days';
      console.error('Error refreshing streak on focus:', err);
    }

  } catch (err) {
    console.error("Failed to load user profile:", err);
    alert("Please log in again!");
    window.location.href = "login.html";
  }

  //save changes (update user info)
  document.getElementById('saveChangesBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const phonenumber = document.getElementById('phone').value.trim();
    const birthday = document.getElementById('dob').value;

    if (!email || !phonenumber || !birthday) {
      alert("Please fill in all fields before saving changes.");
      return;
    }

    try {
      const updatedData = { email, phonenumber, birthday };

      const updateRes = await fetch('/api/profile', {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData)
      });

      if (!updateRes.ok) throw new Error("Failed to update profile");

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Something went wrong while saving your changes. Please try again.");
    }
  });

  //change password
  document.getElementById('updatePasswordBtn').addEventListener('click', async () => {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return alert("Please fill in all password fields.");
    }

    if (newPassword !== confirmPassword) {
      return alert("New passwords do not match.");
    }

    try {
      const res = await fetch('/api/profile/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update password.');
      }

      alert("Password updated successfully!");
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
    } catch (err) {
      console.error("Error updating password:", err);
      alert(err.message);
    }
  });

  //change profile picture
  document.getElementById("changePhotoBtn").addEventListener("click", () => {
    document.getElementById("uploadPicInput").click();
  });

  document.getElementById("uploadPicInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch('/api/profile/upload-avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await res.json();
      
      if (res.ok) {
        document.getElementById("profilePic").src = data.profile_pic;
        alert("Profile picture updated successfully!");
      } else {
        throw new Error(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading image: " + err.message);
    }
  });
});


// delete modal
document.querySelector('#deleteModal .btn-danger').addEventListener('click', async () => {
  if (!confirm("Are you absolutely sure? This will delete everything.")) return;

  try {
    const res = await fetch('/api/profile/delete', {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Failed to delete account.');

    alert("Your account has been deleted. Bye bye 😢");
    window.location.href = '/mainpage.html';
  } catch (err) {
    console.error("Delete error:", err);
    alert("Error deleting account. Please try again.");
  }
});
