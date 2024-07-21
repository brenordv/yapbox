import os

from src.ai_tasks.ai_tasks import AiTasks
from src.ai_utils.ai_context_loader import ContextBuilder
from src.shared.config import ensure_env_is_loaded, SAMPLE_DATASETS_FOLDER
from src.shared.loggers import log_json_to_folder


def main():
    print("YapBox AI :: Data Analyzer")
    print("--------------------------")

    ensure_env_is_loaded()

    cb_loader = ContextBuilder()
    agent = cb_loader.load_agent("data-analyst")

    ai_tasker = AiTasks(
        api_endpoint=os.getenv("OPEN_ROUTER_API_URL"),
        api_key= os.getenv("OPEN_ROUTER_API_KEY"),
        default_model=os.getenv("MODEL_NAME"),
        response_logger=log_json_to_folder
    )

    prompt = ("Analyze the following data and give me the top 3 profiles that will most likely "
              "make a purchase by clicking an ad in our app.")

    data = (SAMPLE_DATASETS_FOLDER
            .joinpath("ad_click_prediction")
            .joinpath("Social_Network_Ads.csv")
            .read_text())

    response = ai_tasker.analyze_data(
        question_or_prompt=prompt,
        data=data,
        is_csv=True,
        agent=agent
    )

    print(f"AI: {response.response}")

    while True:
        user_message = input("User: ")

        response = ai_tasker.ask_a_question(
            question_or_prompt=user_message,
            context=response.updated_context
        )

        print(f"AI: {response.response}")


if __name__ == "__main__":
    main()
