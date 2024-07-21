import os
from pydantic import BaseModel
from typing import List, Optional, Union

import uvicorn
from fastapi import FastAPI, HTTPException

from src.ai_tasks.ai_tasks import AiTasks
from src.ai_tasks.types import ChatContextItem, AiResponse
from src.ai_utils.ai_context_loader import ContextBuilder
from src.shared.config import API_PORT, ensure_env_is_loaded
from src.shared.loggers import log_json_to_folder


ensure_env_is_loaded()

ai_tasker = AiTasks(
    api_endpoint=os.getenv("OPEN_ROUTER_API_URL"),
    api_key=os.getenv("OPEN_ROUTER_API_KEY"),
    default_model=os.getenv("MODEL_NAME"),
    response_logger=log_json_to_folder
)

cb_loader = ContextBuilder()
agent = cb_loader.load_agent("data-analyst")

app = FastAPI()


class AiRequest(BaseModel):
    messages: List[ChatContextItem]
    model: str


class AskQuestionRequest(BaseModel):
    question_or_prompt: str
    system_context: Optional[str] = None
    context: Optional[List[ChatContextItem]] = None


class AnalyzeDataRequest(BaseModel):
    question_or_prompt: str
    data: Union[str, List[str], dict, List[dict]]
    is_csv: Optional[bool] = False
    data_before_prompt: Optional[bool] = False
    context: Optional[List[ChatContextItem]] = None


class UpdateContextRequest(BaseModel):
    latest_message: Optional[ChatContextItem] = None
    system_context: Optional[str] = None
    context: Optional[List[ChatContextItem]] = None
    append_to_system_context: Optional[bool] = False


@app.get("/ping")
async def ping():
    return {"message": "pong"}


@app.post("/ask-question", response_model=AiResponse)
async def ask_question(request: AskQuestionRequest):
    try:
        response = ai_tasker.ask_a_question(
            question_or_prompt=request.question_or_prompt,
            system_context=request.system_context,
            context=request.context
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze-data", response_model=AiResponse)
async def analyze_data(request: AnalyzeDataRequest):
    try:
        response = ai_tasker.analyze_data(
            question_or_prompt=request.question_or_prompt,
            data=request.data,
            is_csv=request.is_csv,
            data_before_prompt=request.data_before_prompt,
            agent=agent,
            context=request.context
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=API_PORT)
