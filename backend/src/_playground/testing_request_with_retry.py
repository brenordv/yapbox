import logging

import backend.src.shared.requests_with_retry as requests


logging.basicConfig(level=logging.DEBUG)


def fail_http_request():
    base_url = "https://httpbin.org/status/"
    requests.get(f"{base_url}404")
    requests.get(f"{base_url}500")
    requests.get(f"{base_url}400")


def main():
    fail_http_request()


if __name__ == '__main__':
    main()
