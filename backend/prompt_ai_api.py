import src.shared.requests_with_retry as requests
from src.shared.config import API_PORT

API_BASE_URL = f"http://localhost:{API_PORT}"


def call_ask_question(question_or_prompt, context=None):
    url = f"{API_BASE_URL}/ask-question"
    payload = {
        "question_or_prompt": question_or_prompt,
        "context": context
    }
    response = requests.post(url, json=payload)
    response.raise_for_status()
    return response.json()


def main():
    print("YapBox AI Prompt :: No personality, agent, or user context")
    print("-----------------------------------------------------------------------------------")

    updated_context = None
    while True:
        user_message = input("User: ")

        response = call_ask_question(
            question_or_prompt=user_message,
            context=updated_context
        )

        updated_context = response['updated_context']

        print(f"AI: {response['response']}")


if __name__ == "__main__":
    main()
