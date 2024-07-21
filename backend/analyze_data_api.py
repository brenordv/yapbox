import src.shared.requests_with_retry as requests
from src.shared.config import SAMPLE_DATASETS_FOLDER, API_PORT


API_BASE_URL = f"http://localhost:{API_PORT}"


def call_analyze_data(prompt, data, is_csv):
    url = f"{API_BASE_URL}/analyze-data"
    payload = {
        "question_or_prompt": prompt,
        "data": data,
        "is_csv": is_csv
    }
    response = requests.post(url, json=payload)
    response.raise_for_status()
    return response.json()


def call_ask_question(question_or_prompt, context):
    url = f"{API_BASE_URL}/ask-question"
    payload = {
        "question_or_prompt": question_or_prompt,
        "context": context
    }
    response = requests.post(url, json=payload)
    response.raise_for_status()
    return response.json()


def main():
    print("YapBox AI :: Data Analyzer")
    print("--------------------------")

    prompt = ("Analyze the following data and give me the top 3 profiles that will most likely "
              "make a purchase by clicking an ad in our app.")

    data = (SAMPLE_DATASETS_FOLDER
            .joinpath("ad_click_prediction")
            .joinpath("Social_Network_Ads.csv")
            .read_text())

    response = call_analyze_data(
        prompt=prompt,
        data=data,
        is_csv=True
    )

    print(f"AI: {response['response']}")

    while True:
        user_message = input("User: ")

        response = call_ask_question(
            question_or_prompt=user_message,
            context=response['updated_context']
        )

        print(f"AI: {response['response']}")


if __name__ == "__main__":
    main()
