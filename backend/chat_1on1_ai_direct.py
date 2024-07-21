import argparse
import os

from src.ai_tasks.ai_tasks import AiTasks
from src.ai_utils.ai_context_loader import ContextBuilder
from src.shared.config import ensure_env_is_loaded
from src.shared.loggers import log_json_to_folder


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

    ai_tasker = AiTasks(
        api_endpoint=os.getenv("AI_API_URL"),
        api_key=os.getenv("AI_API_KEY"),
        default_model=os.getenv("MODEL_NAME"),
        response_logger=log_json_to_folder
    )

    initial_msg = f"$chat$: {character} entered the chat."
    response = ai_tasker.ask_a_question(
        question_or_prompt=initial_msg,  # $chat$ comes from the ruleset
        system_context=personality
    )

    print(initial_msg)
    print(f"{character}: {response.response}")

    while True:
        user_message = input(f"{user}: ")

        response = ai_tasker.ask_a_question(
            question_or_prompt=f"{user}: {user_message}",
            context=response.updated_context
        )

        print(f"{character}: {response.response}")


if __name__ == "__main__":
    main()
