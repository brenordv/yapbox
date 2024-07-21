import json
from typing import List, Dict, Union

from src.ai_utils.types import CustomPersonality
from src.shared.config import AI_VIDEO_GAME_PERSONALITIES_FOLDER, AI_CUSTOM_PERSONALITIES_FOLDER, \
    AI_RULESETS_FOLDER, AI_AGENTS_FOLDER


class ContextBuilder:
    def __init__(self):
        self._available_games: List[str] = []
        self._game_personalities_map: Dict[str, List[str]] = {}
        self._available_video_game_personalities: Dict[str, str] = {}
        self._available_custom_personalities: Dict[str, CustomPersonality] = {}
        self._rulesets: Dict[str, str] = {}
        self._agents: Dict[str, str] = {}

        self._load_rulesets()
        self._load_video_game_personalities()
        self._load_custom_personalities()
        self._load_agents()

    def _load_rulesets(self) -> None:
        for ruleset in AI_RULESETS_FOLDER.rglob("*.txt"):
            if not ruleset.is_file():
                continue

            ruleset_name = ruleset.stem
            ruleset_text = ruleset.read_text()

            self._rulesets[ruleset_name.lower()] = ruleset_text

    def _load_video_game_personalities(self) -> None:
        games = set()
        for personality_file in AI_VIDEO_GAME_PERSONALITIES_FOLDER.rglob("*.txt"):
            if not personality_file.is_file():
                continue

            game_name, character_name = personality_file.stem.split("_")
            game_name = game_name.upper()
            games.add(game_name)

            if game_name not in self._game_personalities_map:
                self._game_personalities_map[game_name] = []

            self._game_personalities_map[game_name].append(character_name)

            personality = personality_file.read_text()

            self._available_video_game_personalities[character_name.lower()] = personality

    def _load_custom_personalities(self) -> None:
        custom_personalities_folders = [p for p in AI_CUSTOM_PERSONALITIES_FOLDER.iterdir() if p.is_dir()]

        for custom_personality_folder in custom_personalities_folders:
            personality_name = custom_personality_folder.name
            base_personality_file = custom_personality_folder.joinpath("base.txt")

            if not base_personality_file.exists():
                continue

            base_personality = base_personality_file.read_text()

            personality_variants_file = custom_personality_folder.joinpath("variants.json")

            if personality_variants_file.exists():
                personality_variants = json.loads(personality_variants_file.read_text())
                variant_intro = personality_variants.get(
                    "_variant_intro",
                    "Consider the following change in personality. You are free to create a role play explanation as to"
                    " why the change, as long as it would make sense for the character.")
            else:
                personality_variants = {}
                variant_intro = None

            self._available_custom_personalities[personality_name.lower()] = CustomPersonality(
                name=personality_name,
                base=base_personality,
                variant_intro=variant_intro,
                variants=personality_variants
            )

    def _load_agents(self) -> None:
        for agent_file in AI_AGENTS_FOLDER.rglob("*.txt"):
            if not agent_file.is_file():
                continue

            agent_name = agent_file.stem
            agent_text = agent_file.read_text()

            self._agents[agent_name.lower()] = agent_text

    def _load_video_game_personality(self, character_name: str) -> Union[str, None]:
        if character_name is None:
            return None

        return self._available_video_game_personalities.get(character_name.lower())

    def _load_custom_personality(self, character_name: str, variant: str) -> Union[str, None]:
        if character_name is None:
            return None

        custom_personality = self._available_custom_personalities.get(character_name.lower())

        if custom_personality is None:
            return None

        personality = custom_personality.base

        if variant is None:
            return personality

        personality_variant = custom_personality.variants.get(variant.lower())

        if personality_variant is None:
            return personality

        variant_intro = custom_personality.variant_intro
        personality = f"{personality}\n{variant_intro}\n{personality_variant}"

        return personality

    def _load_ruleset(self, ruleset):
        return self._rulesets.get(ruleset.lower())

    def load_personality(self, character_name: str, variant: str = None, ruleset: str = None) -> Union[str, None]:
        personality = self._load_video_game_personality(character_name)

        if personality is not None:
            return personality

        personality = self._load_custom_personality(character_name, variant)

        if personality is None or ruleset is None:
            return personality

        ruleset = self._load_ruleset(ruleset)

        if ruleset is None:
            return personality

        return f"{personality}\n\n{ruleset}"

    def load_agent(self, agent_name: str) -> str:
        return self._agents.get(agent_name.lower())
