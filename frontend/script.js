// Toggle Password Visibility
function togglePassword(passwordFieldId) {
  const passwordField = document.getElementById(passwordFieldId);
  passwordField.type = passwordField.type === "password" ? "text" : "password";
}

// Show Signup Form
function showSignup() {
  document.getElementById("signupContainer").style.display = "block";
  document.getElementById("loginForm").parentElement.style.display = "none";
}

// Show Login Form
function showLogin() {
  document.getElementById("signupContainer").style.display = "none";
  document.getElementById("loginForm").parentElement.style.display = "block";
}

// Login Functionality
document.getElementById("loginForm")?.addEventListener("submit", async function (event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const response = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "profile.html";
  } else {
    alert("Couldn't login: Username or password is wrong");
  }
});

// Signup Functionality
document.getElementById("signupForm")?.addEventListener("submit", async function (event) {
  event.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const passwordError = document.getElementById("passwordError");

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    passwordError.textContent = "Password must be at least 8 characters, include letters, numbers, and symbols.";
    return;
  } else {
    passwordError.textContent = "";
  }

  try {
    const response = await fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      alert("Successfully registered");
      window.location.href = "index.html";
    } else {
      alert(data.msg || "Signup failed! Please try again.");
    }
  } catch (error) {
    console.error("Signup Error:", error);
    alert("Error signing up. Please check the console.");
  }
});

// Profile Update
document.getElementById("profileForm")?.addEventListener("submit", async function (event) {
  event.preventDefault();
  const name = document.getElementById("profileName").value.trim();
  const travelInterests = document.getElementById("profileInterests").value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);

  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/profile/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name, travelInterests })
  });

  const data = await response.json();
  if (response.ok) {
    alert("Profile updated successfully!");
  } else {
    alert("Update failed. Please try again.");
  }
});

// Load Profile Info on Page Load
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const profileName = document.getElementById("profileName");
  const profileInterests = document.getElementById("profileInterests");

  // Load profile if on profile page
  if (profileName && token) {
    try {
      const response = await fetch("http://localhost:5000/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const user = await response.json();
      if (response.ok) {
        profileName.value = user.name;
        profileInterests.value = user.travelInterests?.join(", ");
      }
    } catch (err) {
      console.error("Error fetching profile info:", err);
    }
  }
  // ✅ Travel Buddy Search Logic
  document.getElementById("buddySearchForm")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const city = document.getElementById("searchCity").value.trim();
    const preferredDestination = document.getElementById("searchDestination").value.trim();
    const travelInterest = document.getElementById("searchInterest").value.trim();

    try {
      const response = await fetch("http://localhost:5000/buddies/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ city, preferredDestination, travelInterest })
      });

      const data = await response.json();
      const resultsDiv = document.getElementById("buddyResults");
      resultsDiv.innerHTML = "";

      if (data.length === 0) {
        resultsDiv.textContent = "No matches found.";
        return;
      }

      data.forEach(user => {
        const card = document.createElement("div");
        card.className = "buddy-card";
        card.innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Interests:</strong> ${user.travelInterests.join(", ")}</p>
        <button onclick="sendBuddyRequest('${user._id}')">Send Request</button>
      `;
        resultsDiv.appendChild(card);
      });
    } catch (err) {
      console.error("Error fetching buddy matches:", err);
      alert("Failed to search. Try again.");
    }
  });

  // ✅ Send Buddy Request
  async function sendBuddyRequest(receiverId) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/buddies/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ receiverId })
      });

      const result = await response.json();
      alert(result.msg);
    } catch (err) {
      console.error("Request error:", err);
      alert("Failed to send request.");
    }
  }


  // Load homepage destinations
  loadDestinations();
});

// Logout Functionality
document.getElementById("logout")?.addEventListener("click", function () {
  localStorage.removeItem("token");
  alert("Successfully logged out");
  window.location.href = "index.html";
});

// Load Destinations and Packages
async function loadDestinations() {
  try {
    const response = await fetch("http://localhost:5000/destinations");
    const destinations = await response.json();

    const destContainer = document.querySelector(".destinations-carousel");
    const packContainer = document.querySelector(".packages");

    if (!destinations.length) return;

    destContainer.innerHTML = "";
    packContainer.innerHTML = "";

    destinations.forEach(dest => {
      const destCard = document.createElement("div");
      destCard.className = "destination";
      destCard.setAttribute("data-aos", "fade-in");
      destCard.innerHTML = `
        <img src="${dest.imageUrl}" alt="${dest.name}" style="width:100%; height:150px; object-fit:cover; border-radius:10px;">
        <h3>${dest.name}</h3>
        <p>${dest.description}</p>
      `;
      destContainer?.appendChild(destCard);

      const packCard = document.createElement("div");
      packCard.className = "package";
      packCard.setAttribute("data-aos", "flip-left");
      packCard.innerHTML = `
        <h3>${dest.name}</h3>
        <p>${dest.duration}</p>
        <p>₹${dest.price} - ${dest.type}</p>
      `;
      packContainer?.appendChild(packCard);
    });
    // 🔘 Function to send a travel buddy request
    async function sendBuddyRequest(receiverId) {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:5000/buddies/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ receiverId })
        });

        const result = await response.json();
        alert(result.msg);
      } catch (err) {
        console.error("Request error:", err);
        alert("Failed to send request.");
      }
    }


    AOS.init();
  } catch (err) {
    console.error("Failed to load destinations", err);
  }
}
