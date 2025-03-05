document.addEventListener("DOMContentLoaded", function () {
  const messageInput = document.getElementById("messageInput");
  const sendMessageButton = document.getElementById("sendMessage");
  const chatMessages = document.getElementById("chatMessages");

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

    // Simulate bot response
    setTimeout(() => {
      const botMessage = document.createElement("div");
      botMessage.classList.add("message", "bot-message");
      botMessage.textContent = getBotResponse(messageText);
      chatMessages.appendChild(botMessage);

      // Scroll to the bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
  }

  // Bot response
  function getBotResponse(input) {
    const responses = {
      // this is to understand the visuals for now
      hello: "Hi there! How can I help you?",
      long: "this is so longggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg and longgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg to see how it looks",
    };
    return responses[input.toLowerCase()] || "I'm here to support you!";
  }

  // Event Listeners
  sendMessageButton.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") sendMessage();
  });
});
