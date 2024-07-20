import json
from typing import Union, List

from pydantic import BaseModel

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
