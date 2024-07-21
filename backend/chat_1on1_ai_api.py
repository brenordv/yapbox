import argparse

import src.shared.requests_with_retry as requests
from src.ai_utils.ai_context_loader import ContextBuilder
from src.shared.config import ensure_env_is_loaded, API_PORT


API_BASE_URL = f"http://localhost:{API_PORT}"


def get_command_line() -> dict:
    parser = argparse.ArgumentParser(
        description="Chat with a character using specified ruleset and personality variant."
    )

    parser.add_argument(
        "-u", "--user",
        type=str,
        required=True,
        help="Name or nickname of the user (human) in the chat."
    )

    parser.add_argument(
        "-c", "--character",
        type=str,
        required=True,
        help="Name of the character that the user wants to talk to."
    )

    # Add optional arguments with defaults
    parser.add_argument(
        "-r", "--ruleset",
        type=str,
        default="chat",
        help="Name of the ruleset that will be used by the AI. (default: chat)"
    )

    parser.add_argument(
        "-v", "--character_variant",
        type=str,
        default=None,
        help="Name of the personality variant that will be used by the character. (default: None)"
    )

    args = parser.parse_args()

    return {
        "user": args.user,
        "character": args.character,
        "ruleset": args.ruleset,
        "character_variant": args.character_variant
    }


def call_ask_question(question_or_prompt, system_context, context):
    url = f"{API_BASE_URL}/ask-question"
    payload = {
        "question_or_prompt": question_or_prompt,
        "system_context": system_context,
        "context": context
    }
    response = requests.post(url, json=payload)
    response.raise_for_status()
    return response.json()


def main():
    command_line_args = get_command_line()
    user = command_line_args["user"]
    character = command_line_args["character"]
    ruleset = command_line_args["ruleset"]
    character_variant = command_line_args["character_variant"]

    print(f"YapBox AI Chat :: {command_line_args['user']} <-> {command_line_args['character']}")
    print("-----------------------------------------------------------------------------------")

    ensure_env_is_loaded()

    cb_loader = ContextBuilder()
    personality = cb_loader.load_personality(character, character_variant, ruleset)

    initial_msg = f"$chat$: {character} entered the chat."   # $chat$ comes from the ruleset

    response = call_ask_question(
        question_or_prompt=initial_msg,
        system_context=personality,
        context=None
    )

    print(initial_msg)
    print(f"{character}: {response['response']}")

    updated_context = response['updated_context']
    while True:
        user_message = input(f"{user}: ")

        response = call_ask_question(
            question_or_prompt=f"{user}: {user_message}",
            context=updated_context,
            system_context=None
        )

        updated_context = response['updated_context']

        print(f"{character}: {response['response']}")


if __name__ == "__main__":
    main()
