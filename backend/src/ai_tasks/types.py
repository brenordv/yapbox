from typing import List
from pydantic import BaseModel


class ChatContextItem(BaseModel):
    role: str
    content: str


class AiGeneratorConfig(BaseModel):
    base_url: str
    ai_model_name: str


class AiResponse(BaseModel):
    response: str
    updated_context: List[ChatContextItem]
    config: AiGeneratorConfig


class AiRequest(BaseModel):
    messages: List[ChatContextItem]
    model: str
