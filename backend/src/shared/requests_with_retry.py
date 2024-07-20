import requests

from src.decorators.retry import retry_request
from src.shared.serializer import serialize_to_dict

GLOBAL_RETRIES = 3
GLOBAL_DELAY = 1
GLOBAL_DELAY_IS_EXPONENTIAL = True
GLOBAL_SKIP_RETRY_ON_404 = False
GLOBAL_RETRY_ONLY_ON_STATUS_CODES = None
GLOBAL_GET_NEW_TOKEN_ON_401 = None
GLOBAL_GET_NEW_TOKEN_ON_403 = None


def _get_decorator_config() -> dict:
    return {
        "retries": GLOBAL_RETRIES,
        "delay": GLOBAL_DELAY,
        "delay_is_exponential": GLOBAL_DELAY_IS_EXPONENTIAL,
        "skip_retry_on_404": GLOBAL_SKIP_RETRY_ON_404,
        "retry_only_on_status_codes": GLOBAL_RETRY_ONLY_ON_STATUS_CODES,
        "get_new_token_on_401": GLOBAL_GET_NEW_TOKEN_ON_401,
        "get_new_token_on_403": GLOBAL_GET_NEW_TOKEN_ON_403
    }


@retry_request(**_get_decorator_config())
def get(url, params=None, **kwargs) -> requests.Response:
    r"""Sends a GET request.

    :param url: URL for the new :class:`Request` object.
    :param params: (optional) Dictionary, list of tuples or bytes to send
        in the query string for the :class:`Request`.
    :param \*\*kwargs: Optional arguments that ``request`` takes.
    :return: :class:`Response <Response>` object
    :rtype: requests.Response
    """

    return requests.get(url, params=params, **kwargs)


@retry_request(**_get_decorator_config())
def options(url, **kwargs) -> requests.Response:
    r"""Sends an OPTIONS request.

    :param url: URL for the new :class:`Request` object.
    :param \*\*kwargs: Optional arguments that ``request`` takes.
    :return: :class:`Response <Response>` object
    :rtype: requests.Response
    """

    return requests.options(url, **kwargs)


@retry_request(**_get_decorator_config())
def head(url, **kwargs) -> requests.Response:
    r"""Sends a HEAD request.

    :param url: URL for the new :class:`Request` object.
    :param \*\*kwargs: Optional arguments that ``request`` takes. If
        `allow_redirects` is not provided, it will be set to `False` (as
        opposed to the default :meth:`request` behavior).
    :return: :class:`Response <Response>` object
    :rtype: requests.Response
    """

    return requests.head(url, **kwargs)


@retry_request(**_get_decorator_config())
def post(url, data=None, json=None, **kwargs) -> requests.Response:
    r"""Sends a POST request.

    :param url: URL for the new :class:`Request` object.
    :param data: (optional) Dictionary, list of tuples, bytes, or file-like
        object to send in the body of the :class:`Request`.
    :param json: (optional) A JSON serializable Python object to send in the body of the :class:`Request`.
    :param \*\*kwargs: Optional arguments that ``request`` takes.
    :return: :class:`Response <Response>` object
    :rtype: requests.Response
    """
    serialized_json = serialize_to_dict(json)
    return requests.post(url, data=data, json=serialized_json, **kwargs)


@retry_request(**_get_decorator_config())
def put(url, data=None, **kwargs) -> requests.Response:
    r"""Sends a PUT request.

    :param url: URL for the new :class:`Request` object.
    :param data: (optional) Dictionary, list of tuples, bytes, or file-like
        object to send in the body of the :class:`Request`.
    :param json: (optional) A JSON serializable Python object to send in the body of the :class:`Request`.
    :param \*\*kwargs: Optional arguments that ``request`` takes.
    :return: :class:`Response <Response>` object
    :rtype: requests.Response
    """

    if "json" in kwargs:
        kwargs["json"] = serialize_to_dict(kwargs["json"])

    return requests.put(url, data=data, **kwargs)


@retry_request(**_get_decorator_config())
def patch(url, data=None, **kwargs) -> requests.Response:
    r"""Sends a PATCH request.

    :param url: URL for the new :class:`Request` object.
    :param data: (optional) Dictionary, list of tuples, bytes, or file-like
        object to send in the body of the :class:`Request`.
    :param json: (optional) A JSON serializable Python object to send in the body of the :class:`Request`.
    :param \*\*kwargs: Optional arguments that ``request`` takes.
    :return: :class:`Response <Response>` object
    :rtype: requests.Response
    """

    if "json" in kwargs:
        kwargs["json"] = serialize_to_dict(kwargs["json"])

    return requests.patch(url, data=data, **kwargs)


@retry_request(**_get_decorator_config())
def delete(url, **kwargs) -> requests.Response:
    r"""Sends a DELETE request.

    :param url: URL for the new :class:`Request` object.
    :param \*\*kwargs: Optional arguments that ``request`` takes.
    :return: :class:`Response <Response>` object
    :rtype: requests.Response
    """

    return requests.delete(url, **kwargs)
