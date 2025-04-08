document.addEventListener("DOMContentLoaded", function () {
  const messageInput = document.getElementById("messageInput");
  const sendMessageButton = document.getElementById("sendMessage");
  const chatMessages = document.getElementById("chatMessages");

  // Show initial bot welcome message
  function showBotMessage(text) {
    const botMessage = document.createElement("div");
    botMessage.classList.add("message", "bot-message");
    botMessage.textContent = text;
    chatMessages.appendChild(botMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  showBotMessage("Hello!"); // speak to people on what it should be

  // Function to send a message
  function sendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText === "") return;

    // Create user message
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.textContent = messageText;
    chatMessages.appendChild(userMessage);

    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Clear input
    messageInput.value = "";

    // Fetching bot response from Flask API
    fetch("http://127.0.0.1:5000/get-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: messageText }),
    })
      .then((response) => {
        console.log("Raw response:", response);
        return response.json();
      })
      .then((data) => {
        console.log("Parsed response:", data);
        const botMessage = document.createElement("div");
        botMessage.classList.add("message", "bot-message");
        botMessage.textContent = data.response || "Error: No response text";
        chatMessages.appendChild(botMessage);

        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
      })
      .catch((error) => {
        console.error("Error:", error);
        const botMessage = document.createElement("div");
        botMessage.classList.add("message", "bot-message");
        botMessage.textContent =
          "Sorry, I'm having trouble right now. Please try again later.";
        chatMessages.appendChild(botMessage);
      });
  }

  // Event Listeners
  sendMessageButton.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") sendMessage();
  });
});
