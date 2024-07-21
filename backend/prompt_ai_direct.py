import os

from src.ai_tasks.ai_tasks import AiTasks
from src.shared.config import ensure_env_is_loaded
from src.shared.loggers import log_json_to_folder


def main():
    print("YapBox AI Prompt :: No personality, agent, or user context")
    print("-----------------------------------------------------------------------------------")

    ensure_env_is_loaded()

    ai_tasker = AiTasks(
        api_endpoint=os.getenv("AI_API_URL"),
        api_key=os.getenv("AI_API_KEY"),
        default_model=os.getenv("MODEL_NAME"),
        response_logger=log_json_to_folder
    )

    updated_context = None
    while True:
        user_message = input("User: ")

        response = ai_tasker.ask_a_question(
            question_or_prompt=user_message,
            context=updated_context
        )

        updated_context = response.updated_context

        print(f"AI: {response.response}")


if __name__ == "__main__":
    main()
