// // Function to handle token validation on page load
// window.onload = () => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     alert("Please login first.");
//     window.location.href = "login.html"; // Redirect to login if no token
//   } else {
//     verifyToken(token); // If token exists, verify it
//   }
// };

// // Function to verify token on the server
// async function verifyToken(token) {
//   try {
//     const res = await fetch("http://localhost:5000/verify-token", {
//       method: "GET",
//       headers: {
//         "Authorization": `Bearer ${token}` // Send token for verification
//       }
//     });

//     if (!res.ok) {
//       if (res.status === 401 || res.status === 403) {
//         alert("Session expired. Please login again.");
//         localStorage.removeItem("token");
//         window.location.href = "login.html"; // Redirect to login if session expired
//       }
//     } else {
//       const data = await res.json();
//       console.log(data.message); // You can log or do something with the message
//     }
//   } catch (err) {
//     console.error("Token verification failed:", err);
//     alert("Something went wrong. Please try again.");
//     window.location.href = "login.html"; // Redirect to login if token verification fails
//   }
// }

// // Function to handle the user input submission
// async function getIntent() {
//   const input = document.getElementById("userInput").value;

//   if (input.trim() === "") {
//     return; // Ignore empty inputs
//   }

//   // Display the user's message in the chat window
//   addMessage(input, 'user');

//   // Clear the input field
//   document.getElementById("userInput").value = '';

//   const resultBox = document.getElementById("resultBox");
//   const token = localStorage.getItem("token");

//   if (!token) {
//     alert("Please login first.");
//     window.location.href = "login.html"; // Redirect to login if no token
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:5000/ask", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}` // Add token to request header
//       },
//       body: JSON.stringify({ prompt: input }) // Send the user input as the prompt
//     });

//     // Handle session expiration or unauthorized access
//     if (!res.ok) {
//       if (res.status === 401 || res.status === 403) {
//         alert("Session expired. Please login again.");
//         localStorage.removeItem("token");
//         window.location.href = "login.html"; // Redirect to login if session expired
//       } else {
//         const text = await res.text();
//         resultBox.textContent = `Error: ${text}`;
//       }
//       return;
//     }

//     // Get the response from the OpenAI API or backend
//     const data = await res.json();
//     addMessage(data.response, 'bot'); // Display bot's response in the chat window

//   } catch (err) {
//     console.error("Error:", err);
//     addMessage(err, 'bot');
//     resultBox.textContent = "Something went wrong. Please try again.";
//   }
// }

// // Function to add messages to the chat window
// function addMessage(message, sender) {
//   const messageContainer = document.createElement("div");
//   messageContainer.classList.add("message");

//   if (sender === 'bot') {
//     messageContainer.classList.add("bot");
//   }

//   messageContainer.textContent = message;

//   const messages = document.getElementById("messages");
//   messages.appendChild(messageContainer);
//   messages.scrollTop = messages.scrollHeight; // Scroll to the bottom of the chat window
// }

// // Simulate the bot response (can be replaced with OpenAI or server call)
// async function getBotResponse(userMessage) {
//   // Simulating bot response based on user input
//   // Replace this with a real API call or logic
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve("This is a simulated response for: " + userMessage);
//     }, 1000);
//   });
// }

// async function searchUsers() {
//   const skill = document.getElementById("skillInput").value;
//   const range = parseFloat(document.getElementById("rangeInput").value);

//   navigator.geolocation.getCurrentPosition(async (pos) => {
//     try {
//       const centerLat = pos.coords.latitude;
//       const centerLon = pos.coords.longitude;

//       const res = await fetch("http://localhost:5000/search", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ skill, centerLat, centerLon, radius: range })
//       });

//       const users = await res.json();

//       map.setView([centerLat, centerLon], 13);
//       L.marker([centerLat, centerLon]).addTo(map).bindPopup("You are here");

//       users.forEach(user => {
//         L.marker([user.latitude, user.longitude])
//           .addTo(map)
//           .bindPopup(`${user.name} - ${user.skill}`);
//       });
//     } catch (err) {
//       alert("Something went wrong while fetching users.");
//       console.error(err);
//     }
//   });
// }



// =======================================================




// Token check on page load
window.onload = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
  } else {
    verifyToken(token);
  }
};

// Token verification
async function verifyToken(token) {
  try {
    const res = await fetch("http://localhost:3000/verify-token", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
      }
    } else {
      const data = await res.json();
      console.log(data.message);
    }
  } catch (err) {
    console.error("Token verification failed:", err);
    alert("Something went wrong. Please try again.");
    window.location.href = "login.html";
  }
}

// Get user intent and interact with /ask
async function getIntent() {
  const input = document.getElementById("userInput").value.trim();
  if (input === "") return;

  addMessage(input, 'user');
  document.getElementById("userInput").value = '';

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ prompt: input })
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
      } else {
        const text = await res.text();
        showError("somthings wrong here ....");
        // console.log("error");
      
      }
      
      return;
    }

    const data = await res.json();
    addMessage(data.response, 'bot');

  } catch (err) {
    console.error("Error:", err);
    addMessage("Something went wrong. Please try again.", 'bot');
  }
}

// Add message to chat
function addMessage(message, sender) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message");
  if (sender === 'bot') messageContainer.classList.add("bot");

  messageContainer.textContent = message;

  const messages = document.getElementById("messages");
  if (messages) {
    messages.appendChild(messageContainer);
    messages.scrollTop = messages.scrollHeight;
  }
}

// Optional error box (if you have resultBox in HTML)
function showError(message) {
  const resultBox = document.getElementById("resultBox");
  if (resultBox) {
    resultBox.textContent = message;
  } else {
    addMessage(message, 'bot');
  }
}


