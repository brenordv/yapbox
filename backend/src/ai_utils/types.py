from enum import Enum
from typing import Dict

from pydantic import BaseModel


class ContextType(Enum):
    VideoGamePersonalities = "VideoGamePersonalities"
    CustomPersonalities = "CustomPersonalities"


class CustomPersonality(BaseModel):
    name: str
    base: str
    variant_intro: str
    variants: Dict[str, str]