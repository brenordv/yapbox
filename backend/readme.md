# YapBox - Backend

A bunch of tools and helper functions to reach out to an OpenAI (or similar) API, and to handle the responses.
I created 3 ways to interact with it:

1. Common prompt, without any customization;
2. With the AI role-playing as a character from a video game;
3. With AI acting like a data analyst ready to give you insights about your data.

# What this project contains
## Pre-defined personalities from video games
They are only the first version, and miles far from perfect. TBH, I haven't tested all of them yet, but I'm working on it.

One thing I noticed is that, depending on the LLM model you use, they will behave wildly artificially. 
For example: Using `undi95/toppy-m-7b:free` Shadowheart keeping shouting out that she's a Shar's follower, and that 
she's a cleric of Shar, etc. However, if I use `gpt-3.5-turbo`, she behaves more naturally.

| Game            | Character                |
|-----------------|--------------------------|
| Baldur's Gate 3 | Astarion                 |
| Baldur's Gate 3 | Aylin                    |
| Baldur's Gate 3 | Gale                     |
| Baldur's Gate 3 | Halsin                   |
| Baldur's Gate 3 | Isobel                   |
| Baldur's Gate 3 | Jaheira                  |
| Baldur's Gate 3 | Karlac                   |
| Baldur's Gate 3 | Lae`zel                  |
| Baldur's Gate 3 | Minsc                    |
| Baldur's Gate 3 | Minthara                 |
| Baldur's Gate 3 | Shadowheart              |
| Baldur's Gate 3 | Wyll                     |
| Fallout 4       | Cait                     |
| Fallout 4       | Cogsworth                |
| Fallout 4       | Curie                    |
| Fallout 4       | Mama Murphy              |
| Fallout 4       | Nick Valentine           |
| Fallout 4       | Paladin Danse            |
| Fallout 4       | Preston Garvey           |
| Skyrim          | Serana                   |

## Pre-defined agent
This agent is a data analyst, and it's supposed to help you with your data. It's not perfect, but it's a start.

## Pre-defined rulesets
Those are instructions that can be added to any context (video game character or agent) telling AI how to behave in more
general terms. Right now, I created only one to control their behavior in a chatroom.

## Sample dataset
I got from Kaggle a small dataset with ad clicks/purchases on a social network site. It's a very simple CSV file, but 
enough to test if things are working.

# How to use it
First, install the requirements:

```bash
pip install -r requirements.txt
```

Then, in the root of this project (backend), create a .env file with the following content:
```dotenv
AI_API_URL=url to the API you're using
AI_API_KEY=your-api-key
MODEL_NAME=name of the model to be used.
``` 

I've tested using OpenRouter and OpenAI, but any API that follows the same pattern should work.

Then run one of the scripts:
- `prompt_ai_direct.py`: This script will let you send prompts to the AI without giving any context/personality first;
- `prompt_ai_api.py`: Same thing from the previous script, but calling our local api (as a wrapper);
- `analyze_data_direct.py`: This script will use the agent to analyze the sample dataset;
- `analyze_data_api.py`: Same thing from the previous script, but calling our local api (as a wrapper);
- `chat_1on1_ai_direct.py`: This script will let you chat with the AI using a video game character as a personality;
- `chat_1on1_ai_api.py`: Same thing from the previous script, but calling our local api (as a wrapper);

Note that for all scripts that use our local API, you'll need to start it first by running:
```bash
python api.py
```

Specifically for the last two scripts, there's a commandline syntax:
```text
usage: chat_1on1_ai_api.py [-h] -u USER -c CHARACTER [-r RULESET] [-v CHARACTER_VARIANT]
```

Example:
``` python
python chat_1on1_ai_api.py -u MyName -c Shadowheart
```

Note: character variant is optional and applied only to custom personalities, but I'll expand on that later.