from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# ---------------- Global Variables ---------------- #
in_rps_game = False
rps_choices = ["rock", "paper", "scissors"]

# ---------------- Sample Responses ---------------- #
jokes = [
    "Why did the student eat his homework? Because the teacher said it was a piece of cake! 🍰",
    "Why did the math book look sad? Because it had too many problems. 🤓",
    "Why was the computer cold? Because it forgot to close its Windows! 💻❄️"
]

# Playful, cheerful poems / lines
songs_poems = [
    "🌸 'Buzzing through the flowers, spreading joy for hours!'",
    "🎵 'Wings so small, heart so bright, BEE-BLUE is here to light your night!'",
    "✨ 'Happiness is a little thing, like the songs that busy bees sing.'",
    "🌟 'Flutter, twirl, and hum along, every day can be a happy song!'",
    "🍯 'Sweet as honey, bright as the sun, I’m here with you, let’s have some fun!'",
    "🎶 'Tiny wings, a cheerful spree, I am BEE-BLUE, your buddy bee!'"
]

# Emotional keywords & responses
emotional_responses = {
    "sad": "I'm here for you. It's okay to feel sad sometimes 💜",
    "stressed": "Take a deep breath. You can handle this! 🌿",
    "overwhelmed": "Take one step at a time. You're doing great 🌸",
    "lonely": "I’m here with you. You’re not alone 💛",
    "happy": "Yay! I’m glad to hear that 😄",
    "tired": "Rest is important. Make sure to take care of yourself 🛌"
}

# Greetings
greetings = ["hi", "hello", "hey", "hola"]

# Fun playful lines for casual chats
fun_lines = [
    "I’m humming a tune 🎵 just for you!",
    "Buzz buzz! Ready to cheer you up 🌸",
    "I’m floating around, spreading positive vibes 🐝",
    "Hey there! Let’s make today a little brighter ☀️"
]

# ---------------- Bot Logic ---------------- #
def get_bot_response(user_message):
    global in_rps_game
    user_message_lower = user_message.lower().strip()

    # ---------------- Greetings ---------------- #
    if any(greet in user_message_lower for greet in greetings):
        return "I am BEE-BLUE, your companion 🐝 How are you feeling today?"

    # ---------------- How are you ---------------- #
    if "how are you" in user_message_lower:
        return "I’m buzzing with energy! 🐝 How about you?"

    # ---------------- Emotional Statements ---------------- #
    for keyword, response in emotional_responses.items():
        if keyword in user_message_lower:
            return response

    # ---------------- Fun / Casual Lines ---------------- #
    if "what are you doing" in user_message_lower or "tell me something" in user_message_lower:
        return random.choice(fun_lines)

    # ---------------- Rock-Paper-Scissors ---------------- #
    if user_message_lower in ["play rps", "rock-paper-scissors", "mind game", "play game"]:
        in_rps_game = True
        return "🎮 Let's play Rock-Paper-Scissors! Type your choice: rock, paper, or scissors."

    if in_rps_game:
        if user_message_lower in rps_choices:
            bot_choice = random.choice(rps_choices)
            user = user_message_lower
            bot = bot_choice

            if user == bot:
                result = f"I chose {bot}. It's a tie! 🤝"
            elif (user == "rock" and bot == "scissors") or \
                 (user == "paper" and bot == "rock") or \
                 (user == "scissors" and bot == "paper"):
                result = f"I chose {bot}. You win! 🎉"
            else:
                result = f"I chose {bot}. You lose! 😅"

            result += " Type rock, paper, or scissors to play again, or type 'exit game' to stop."
            return result

        elif user_message_lower == "exit game":
            in_rps_game = False
            return "Exited Rock-Paper-Scissors. 🎮 You can choose another feature!"
        else:
            return "Please type rock, paper, or scissors to play, or 'exit game' to stop."

    # ---------------- Jokes ---------------- #
    elif "joke" in user_message_lower:
        return random.choice(jokes)

    # ---------------- Songs / Poems ---------------- #
    elif "song" in user_message_lower or "poem" in user_message_lower:
        return random.choice(songs_poems)

    # ---------------- Exit ---------------- #
    elif "bye" in user_message_lower or "exit" in user_message_lower:
        return "Goodbye! Remember, BEE-BLUE is always here if you need a friend. 💜"

    # ---------------- Default ---------------- #
    else:
        return "I’m here for you. Tell me more about your day or choose a feature below!"

# ---------------- Flask Routes ---------------- #
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    bot_reply = get_bot_response(user_message)
    return jsonify({"reply": bot_reply})

if __name__ == "__main__":
    app.run(debug=True)
