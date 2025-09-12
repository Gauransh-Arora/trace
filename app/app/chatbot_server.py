from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import ask_perplexity

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    question = data.get("question")
    history = data.get("history", [])
    answer = ask_perplexity(question, history)
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(port=5000)
