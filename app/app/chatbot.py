import requests
import os

# Set up the API endpoint and headers
url = "https://api.perplexity.ai/chat/completions"
headers = {
   "Authorization": f"Bearer {os.getenv('PERPLEXITY_API_KEY')}",  # Use environment variable
    "Content-Type": "application/json"
}

def ask_perplexity(question, history=None):
    messages = history if history else []
    messages.append({"role": "user", "content": question})

    payload = {
        "model": "sonar-pro",
        "messages": messages
    }

    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        return f"Error: API request failed with status {response.status_code}"

    data = response.json()
    # Return just the content of the AI's response
    return data["choices"][0]['message']['content']

def main():
    print("Welcome to TRACE Travel Assistant Bot! Ask me anything about your travel safety and plans.\nType 'exit' to quit.")
    history = []
    while True:
        user_input = input("You: ")
        if user_input.strip().lower() in ("exit", "quit"):
            print("Thank you for using TRACE Travel Assistant. Safe travels!")
            break
        answer = ask_perplexity(user_input, history)
        history.append({"role": "assistant", "content": answer})
        print(f"Bot: {answer}\n")

if __name__ == "__main__":
    main()
