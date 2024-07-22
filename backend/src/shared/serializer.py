from datetime import datetime
from io import StringIO
from typing import Union, List
from pydantic import BaseModel
import csv


_JSON_DUMPS_PARAMS = {
    "indent": 2,
    "ensure_ascii": True
}


def obj_to_dict(obj) -> dict:
    if issubclass(type(obj), BaseModel):
        # If it's a BaseModel, convert it to a dict using that fancy helper.
        obj = obj.dict()

    elif hasattr(obj, '__dict__'):
        # If it's an object, convert it to a dict using the __dict__ attribute.
        obj = obj.__dict__

    # Else: No idea how to convert it to a dict, so just return it as is.

    # Return the (hopefully) converted object.
    return obj


def serialize_to_dict(obj) -> Union[dict, List[dict], None]:
    """
    Serialize obj to a dict or a list of dicts. Useful when sending complex objects in http requests.
    If the obj passed is a dict, will iterate over all the properties and convert them to dicts.
    Remarks: This scans the object recursively.

    :param obj: The object to be serialized
    :return: The serialized JSON object or None if the object is None.
    """
    if obj is None:
        return None

    if isinstance(obj, list):
        serialized = [obj_to_dict(item) for item in obj]
    elif isinstance(obj, dict):
        serialized = {}
        for key, value in obj.items():
            serialized[key] = serialize_to_dict(value)
    else:
        serialized = obj_to_dict(obj)

    return serialized


def parse_csv(csv_data: str) -> List[dict]:
    """
    Parses a CSV string and returns a list of dictionaries.
    """
    csv_file = StringIO(csv_data)
    reader = csv.DictReader(csv_file)
    return [row for row in reader]


def csv_string_to_dict_list(
        data: Union[str, List[str], dict, List[dict]],
        no_data_return: str = "No data available"
) -> Union[List[dict], str]:
    """
    Converts a CSV string to a list of dictionaries.
    The first row is considered the header row.
    :param no_data_return: The value to return if no data is available.
    :param data: The CSV string.
    :return: A list of dictionaries or the no_data_return value if no data is available.
    """
    if isinstance(data, str):
        return parse_csv(data)
    elif isinstance(data, list):
        result = []
        [result.extend(csv_string_to_dict_list(d)) for d in data]
        return result

    return no_data_return


def dataset_to_prompt_text(dataset: List[dict]) -> str:
    """
    Converts a dataset to a prompt text.
    :param dataset: The dataset.
    :return: The prompt text.
    """
    if dataset is None or not isinstance(dataset, list):
        return str(dataset)

    data = []
    for row in dataset:
        item ={}
        for key, value in row.items():
            if isinstance(value, datetime):
                item[key] = value.strftime("%Y-%m-%d %H:%M:%S.%f")
                continue

            item[key] = value

        data.append(item)

    return str(data)
