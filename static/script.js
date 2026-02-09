// ---------------- Toggle chat visibility ----------------
function toggleChat() {
    const chat = document.getElementById("chat-container");
    const button = document.querySelector(".app-icon");

    chat.classList.toggle("active");

    if (chat.classList.contains("active")) {
        button.style.display = "none";   // hide button
    } else {
        button.style.display = "block";  // show button again
    }
}



// ---------------- Game Mode Tracker ----------------
let gameMode = false; // Tracks if user is playing Rock-Paper-Scissors

// ---------------- Add Message to Chat ----------------
function addMessage(message, className) {
    const chatBox = document.getElementById("chat-box");
    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-message " + className;
    msgDiv.textContent = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ---------------- Send Message to Backend ----------------
async function sendMessage() {
    const inputBox = document.getElementById("user-input");
    let message = inputBox.value.trim();
    if (message === "") return;

    addMessage(message, "user-message");

    // If in game mode and input is not rock/paper/scissors or exit game
    if (gameMode && !["rock", "paper", "scissors", "exit game"].includes(message.toLowerCase())) {
        message = "play rps"; // keep bot in RPS mode
    }

    inputBox.value = "";

    const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    addMessage(data.reply, "bot-message");

    // Exit RPS mode if user types "exit game"
    if (message.toLowerCase() === "exit game") gameMode = false;
}

// ---------------- Feature Buttons ----------------
function useFeature(feature) {
    let message = "";

    switch(feature) {
        case "joke":
            message = "Tell me a joke";
            break;
        case "quote":
            message = "Give me a positive quote";
            break;
        case "song":
            message = "Share a song or poem";
            break;
        case "game":
            message = "play rps"; // triggers RPS
            gameMode = true; // enter game mode
            break;
    }

    addMessage(message, "user-message");
    sendMessageToServer(message);
}

// ---------------- Send message helper for feature buttons ----------------
function sendMessageToServer(message) {
    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
        addMessage(data.reply, "bot-message");

        if (message.toLowerCase() === "exit game") gameMode = false;
    });
}

// ---------------- Daily Quote ----------------
const quotes = [
    "Every day may not be good, but there is something good in every day. 🌸",
    "You are stronger than you think. Keep going! 💪",
    "Believe you can and you're halfway there. 🌟",
    "Happiness is a journey, not a destination. 😊",
    "Small steps every day lead to big results. 🌱"
];

window.onload = () => {
    const dailyQuote = document.getElementById("daily-quote");
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    dailyQuote.textContent = randomQuote;
};

// ---------------- Mini Number Guess Game ----------------
let randomNumber = Math.floor(Math.random() * 10) + 1;

function checkGuess() {
    const userGuess = parseInt(document.getElementById("game-input").value);
    const feedback = document.getElementById("game-feedback");

    if (!userGuess || userGuess < 1 || userGuess > 10) {
        feedback.textContent = "Please enter a number between 1 and 10.";
        return;
    }

    if (userGuess === randomNumber) {
        feedback.textContent = "🎉 Congrats! You guessed it right!";
        randomNumber = Math.floor(Math.random() * 10) + 1;
    } else if (userGuess < randomNumber) {
        feedback.textContent = "Too low! Try a higher number.";
    } else {
        feedback.textContent = "Too high! Try a lower number.";
    }

    document.getElementById("game-input").value = "";
}

// ---------------- Clear Chat ----------------
function clearChat() {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";
    gameMode = false; // exit game mode
}

// ---------------- Enter Key Listener ----------------
const inputBox = document.getElementById("user-input");

inputBox.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

// ---------------- Mood Tracking ----------------
function recordMood(emoji) {
    const feedback = document.getElementById("mood-feedback");
    let response = "";

    switch(emoji) {
        case "😊":
            response = "Yay! Happy vibes! Keep smiling 😄";
            break;
        case "😔":
            response = "I’m here for you. Take a deep breath 💜";
            break;
        case "😡":
            response = "It’s okay to feel angry. Try to relax 🧘";
            break;
        case "😌":
            response = "Glad you’re feeling calm. Keep this peace 🌿";
            break;
        case "😢":
            response = "It’s okay to cry. Emotions are natural 🌸";
            break;
        case "😃":
            response = "Awesome! Keep spreading positive energy 😃";
            break;
    }

    feedback.textContent = response;
}

// ---------------- Start Chat from Welcome Panel ----------------
function startChat() {
    document.getElementById("welcome-panel").style.display = "none";
    toggleChat(); // open chat automatically
}


