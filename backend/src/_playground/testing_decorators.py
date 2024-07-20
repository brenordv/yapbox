import logging
import random
import time

from backend.src.decorators.benchmark import benchmark
from backend.src.decorators.retry import retry

logging.basicConfig(level=logging.DEBUG)


@retry
def i_am_going_to_fail():
    time.sleep(1)
    raise Exception('I am a failure!')


@retry()
def i_am_also_going_to_fail():
    time.sleep(1)
    raise Exception('I am also a failure!')


@benchmark
def to_benchmark():
    time.sleep(random.randint(1, 3))


def main():
    to_benchmark()
    to_benchmark()
    to_benchmark()
    print(f"Benchmark results: {to_benchmark.get_benchmark_info()}")

    try:
        i_am_going_to_fail()
    except Exception as e:
        print(f"Caught exception: {e}")

    try:
        i_am_also_going_to_fail()
    except Exception as e:
        print(f"Caught exception: {e}")


if __name__ == '__main__':
    main()
