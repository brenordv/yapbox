import re
from typing import List, Callable, Union

from src.ai_tasks.types import ChatContextItem, AiResponse, AiRequest, AiGeneratorConfig
from src.shared.http import get_headers
import src.shared.requests_with_retry as requests
from src.shared.serializer import serialize_to_dict, csv_string_to_dict_list, dataset_to_prompt_text


class AiTasks:
    def __init__(self, api_endpoint: str, api_key: str, default_model: str, response_logger: Callable[[dict], None]):
        self.api_endpoint: str = api_endpoint
        self.api_key: str = api_key
        self.model: str = default_model
        self.response_logger: Callable[[dict], None] = response_logger

    @staticmethod
    def _update_system_context(
            system_context: str,
            context: List[ChatContextItem],
            append_to_system_context: bool
    ) -> List[ChatContextItem]:
        """
        Update context with the system context, which is a text that will give the AI context while answering
        the question.
        :param system_context: How the AI should answer the question/behave.
        :param context: Current context (previous messages).
        :param append_to_system_context: If True, the system context will be appended to the current system context.
        :return: The updated context.
        """
        system_context_item = ChatContextItem(role="system", content=system_context)

        # If there"s no context yet, just add the system context and return
        if len(context) == 0:
            return [system_context_item]

        current_sys_context = context[0] if context[0].role == "system" else None

        # If the system context is already in the context, and we want to append to it, then do so
        if append_to_system_context and current_sys_context is not None:
            current_sys_context["content"] += f" {system_context}"
            context[0] = current_sys_context
            return context

        # Otherwise, it means that the context is not empty, but we don"t have a system context yet
        context.insert(0, system_context_item)
        return context

    def _update_context(
            self,
            latest_message: ChatContextItem = None,
            system_context: str = None,
            context: List[ChatContextItem] = None,
            append_to_system_context: bool = False
    ) -> List[ChatContextItem]:
        """
        Update the context with the latest message, system context, and append to system context.
        This will make it ready to be sent to the AI model.
        :param latest_message: The latest message to add to the context. This can either be a new message from the user
        or the response received from the AI model.
        :param system_context: How the AI should answer the question/behave.
        :param context: Current context (previous messages).
        :param append_to_system_context: If True, the system context will be appended to the current system context.
        :return: The updated context.
        """
        if context is None:
            context = []

        if system_context is not None:
            context = self._update_system_context(system_context, context, append_to_system_context)

        if latest_message is not None:
            context.append(latest_message)

        return context

    def _build_request_payload(self, context: List[ChatContextItem]) -> AiRequest:
        """
        Build the payload for the request to the AI model.
        :param context: The context to send to the AI model.
        :return: The payload for the request.
        """
        return AiRequest(messages=context, model=self.model)

    def _send_request_to_ai(self, context: List[ChatContextItem]) -> dict:
        """
        Send the context to the AI model and get the response.
        :param context: The context to send to the AI model.
        :return: The response from the AI model.
        """
        # Define the header for the request
        headers = get_headers(token=self.api_key)

        # Construct the payload for the request
        payload = self._build_request_payload(context)

        # Make the API request
        response = requests.post(self.api_endpoint, headers=headers, json=payload)

        # If the request was not successful, raise an exception.
        response.raise_for_status()

        try:
            return response.json()
        except ValueError:
            raise ValueError(f"Failed to parse response from the AI model: {response.text}")

    @staticmethod
    def _extract_data_from_response(response: dict) -> ChatContextItem:
        """
        Extract the message from the AI response.
        :param response: The response from the AI model. This is their "raw" JSON.
        :return: The message from the AI response.
        """
        try:
            # Extract messages from all choices and concatenate them
            response_messages = [choice["message"]["content"] for choice in response["choices"]]
            concatenated_message = " ".join(response_messages)

            # Normalize string.
            # Remove newlines and extra spaces. For some reason some models tend to add those in their responses for no
            # apparent reason.
            concatenated_message = re.sub(r"^\s+|\s+$", " ", concatenated_message).strip()

            return ChatContextItem(role="assistant", content=concatenated_message)
        except (IndexError, KeyError) as e:
            raise ValueError("Invalid AI response format") from e

    def _log_ai_interaction(self, response: AiResponse, api_response: dict):
        """
        Log the interaction with the AI model.
        :param response: The response from the AI model with extra information.
        :param api_response: The raw response from the API.
        """
        if self.response_logger is None:
            return

        self.response_logger(serialize_to_dict({
            "parsed_response": response,
            "api_response": api_response,
        }))

    def _fetch_data_from_query(self, query: str) -> Union[str, List[str], None]:
        """
        Fetch data from the Database using a query.
        :param query: The query to fetch the data.
        :return: The data fetched from the Database.
        """
        # TODO: Implement this... maybe.
        return None

    def _prepare_datasets(
            self,
            is_csv: bool,
            data: Union[str, List[str], dict, List[dict]],
            dataset_from_file: str,
            query: str) -> str:
        prepared = [
            "Main dataset:",
            dataset_to_prompt_text(csv_string_to_dict_list(data)) if is_csv else data,
        ]

        if dataset_from_file is not None:
            prepared.append("\nDataset from file:")
            prepared.append(dataset_to_prompt_text(csv_string_to_dict_list(dataset_from_file)))

        if query is not None:
            query_data = self._fetch_data_from_query(query)
            prepared.append("Dataset from query:")
            prepared.append(dataset_to_prompt_text(query_data) if query_data is not None else "Query yielded no results.")

        return "\n".join(prepared)

    def ask_a_question(
            self,
            question_or_prompt: str,
            system_context: str = None,
            context: List[ChatContextItem] = None
    ) -> AiResponse:
        """
        Ask a question to the AI model.

        :param question_or_prompt: The question to ask the AI model.
        :param system_context: A text that will give the AI context while answering the question.
        (Optional. Default: Nothing. Just let the AI be themselves.)
        :param context: A list of previous messages that the AI should consider while answering the question.
        (Optional. Default: Nothing. Will be created automatically when the AI answers the question.)
        :return: The response from the AI with extra information.
        """
        # Converting the question to a message that will be sent in the context to the AI model
        message = ChatContextItem(role="user", content=question_or_prompt)

        # Updating the context with the latest message and system context (if provided)
        updated_context = self._update_context(latest_message=message, system_context=system_context, context=context)

        # Sending the context to the AI model and getting the response
        json_response = self._send_request_to_ai(updated_context)

        # Extracting the message from the AI response
        response = self._extract_data_from_response(json_response)

        # Update the context again, now with the response from the AI model
        updated_context = self._update_context(latest_message=response, context=updated_context)

        # Converts the response to the AiResponse type
        response = AiResponse(
            response=response.content,
            updated_context=updated_context,
            config=AiGeneratorConfig(
                base_url=self.api_endpoint,
                ai_model_name=self.model
            )
        )

        # Log the interaction with the AI model
        self._log_ai_interaction(response, json_response)

        return response

    def analyze_data(
            self,
            question_or_prompt: str,
            data: Union[str, List[str], dict, List[dict]],
            is_csv: bool = False,
            data_before_prompt: bool = False,
            agent: str = None,
            context: List[ChatContextItem] = None,
            query: str = None,
            data_from_file: str = None
    ) -> AiResponse:
        """
        Analyze data with the AI model.

        :param question_or_prompt: The question to ask the AI model.
        :param data: The data to analyze with the AI model.
        :param is_csv: If the data is in CSV format. (Optional. Default: False)
        :param data_before_prompt: If the data should be sent before the prompt. (Optional. Default: False)
        :param agent:  A text that will give the AI context while answering the question.
        (Optional. Default: Nothing. Just let the AI be themselves.)
        :param context: A list of previous messages that the AI should consider while answering the question.
        (Optional. Default: Nothing. Will be created automatically when the AI answers the question.)
        :param query: A query to get data from the Database. (Optional. Default: None)
        :param data_from_file: Extra data to use in the prompt. (Optional. Default: None)
        :return: The response from the AI with extra information.
        """
        serialized_data = self._prepare_datasets(is_csv, data, data_from_file, query)

        if data_before_prompt:
            prompt = f"{serialized_data}\n\n{question_or_prompt}"
        else:
            prompt = f"{question_or_prompt}\n\n{serialized_data}"

        return self.ask_a_question(
            question_or_prompt=prompt,
            system_context=agent,
            context=context
        )
