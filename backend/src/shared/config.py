from dotenv import load_dotenv

from pathlib import Path

# backend/
ROOT_FOLDER = Path(__file__).parent.parent.parent

# backend/src/
SRC_FOLDER = ROOT_FOLDER.joinpath("src")

# backend/.data
DATA_FOLDER = ROOT_FOLDER.joinpath(".data")

# backend/.data/ai_system_contexts
AI_SYS_CONTEXTS_FOLDER = DATA_FOLDER.joinpath("ai_system_contexts")

# backend/.data/ai_system_contexts/personalities
AI_PERSONALITIES_BASE_FOLDER = AI_SYS_CONTEXTS_FOLDER.joinpath("personalities")

# backend/.data/ai_system_contexts/personalities/video_games
AI_VIDEO_GAME_PERSONALITIES_FOLDER = AI_PERSONALITIES_BASE_FOLDER.joinpath("video_games")

# backend/.data/ai_system_contexts/personalities/custom
AI_CUSTOM_PERSONALITIES_FOLDER = AI_PERSONALITIES_BASE_FOLDER.joinpath("custom")

# backend/.data/ai_system_contexts/rulesets
AI_RULESETS_FOLDER = AI_SYS_CONTEXTS_FOLDER.joinpath("rulesets")

# backend/.data/ai_system_contexts/agents
AI_AGENTS_FOLDER = AI_SYS_CONTEXTS_FOLDER.joinpath("agents")

SAMPLE_DATASETS_FOLDER = DATA_FOLDER.joinpath("sample_datasets")

# backend/.logs
LOG_FOLDER = ROOT_FOLDER.joinpath(".logs")

ENV_FILE = ROOT_FOLDER.joinpath(".env")

if not ENV_FILE.exists():
    raise FileNotFoundError(f"File {ENV_FILE} not found")

load_dotenv(ENV_FILE)

# Create the required folders if they don't exist.
for required_folder in [DATA_FOLDER, LOG_FOLDER, AI_SYS_CONTEXTS_FOLDER, AI_PERSONALITIES_BASE_FOLDER,
                        AI_VIDEO_GAME_PERSONALITIES_FOLDER, AI_CUSTOM_PERSONALITIES_FOLDER,
                        AI_RULESETS_FOLDER, AI_AGENTS_FOLDER]:
    if required_folder.exists():
        continue

    required_folder.mkdir(exist_ok=True)


def ensure_env_is_loaded():
    if not ENV_FILE.exists():
        raise FileNotFoundError(f"File {ENV_FILE} not found")

    load_dotenv(ENV_FILE)
