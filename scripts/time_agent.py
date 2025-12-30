from __future__ import annotations
import os
import json
import logging
import time as time_module
from datetime import datetime
from zoneinfo import ZoneInfo
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import OpenAI

# Basic logging
logging.basicConfig(level=os.getenv("TIME_AGENT_LOG_LEVEL", "INFO"))
logger = logging.getLogger("time_agent")

# Token provider for Azure OpenAI (AAD)
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default"
)

# Reuse a single OpenAI client instance
client = OpenAI(
    base_url=os.getenv("AZURE_OPENAI_BASE_URL", "https://YOUR-RESOURCE-NAME.openai.azure.com/"),
    api_key=token_provider,
)

DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "<YOUR_DEPLOYMENT_NAME_HERE>")

TIMEZONE_DATA = {
    "tokyo": "Asia/Tokyo",
    "san francisco": "America/Los_Angeles",
    "paris": "Europe/Paris",
}

def get_current_time(location: str) -> str:
    logger.debug("get_current_time called with location: %s", location)
    location_lower = (location or "").lower()
    for key, timezone in TIMEZONE_DATA.items():
        if key in location_lower:
            current_time = datetime.now(ZoneInfo(timezone)).strftime("%I:%M %p")
            return json.dumps({"location": location, "current_time": current_time})
    logger.warning("No timezone data found for: %s", location)
    return json.dumps({"location": location, "current_time": "unknown"})

def _api_call_with_retries(func, *args, max_retries: int = 3, backoff_base: float = 1.0, **kwargs):
    attempt = 0
    while True:
        try:
            return func(*args, **kwargs)
        except Exception as e:
            attempt += 1
            msg = str(e).lower()
            # simple retry heuristic
            retryable = ("429" in msg) or ("rate limit" in msg) or ("timeout" in msg) or attempt < max_retries
            if attempt >= max_retries or not retryable:
                logger.exception("API call failed (no more retries): %s", e)
                raise
            sleep = backoff_base * (2 ** (attempt - 1))
            logger.warning("API call failed (attempt %d/%d). Retrying in %.1fs. Error: %s", attempt, max_retries, sleep, e)
            time_module.sleep(sleep)

def run_conversation(user_prompt: str = "What's the current time in San Francisco") -> str:
    messages = [{"role": "user", "content": user_prompt}]

    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_current_time",
                "description": "Get the current time in a given location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string", "description": "The city name, e.g. San Francisco"},
                    },
                    "required": ["location"],
                },
            },
        }
    ]

    # Ask the model and allow it to call the tool
    logger.info("Sending initial chat completion request to model %s", DEPLOYMENT)
    response = _api_call_with_retries(
        client.chat.completions.create, model=DEPLOYMENT, messages=messages, tools=tools, tool_choice="auto"
    )
    response_message = response.choices[0].message
    messages.append(response_message)
    logger.debug("Model response: %s", response_message)

    # Handle tool/function calls if any
    if getattr(response_message, "tool_calls", None):
        for tool_call in response_message.tool_calls:
            try:
                if tool_call.function.name == "get_current_time":
                    function_args = json.loads(tool_call.function.arguments)
                    logger.info("Invoking get_current_time with args: %s", function_args)
                    time_response = get_current_time(location=function_args.get("location"))
                    messages.append(
                        {
                            "tool_call_id": tool_call.id,
                            "role": "tool",
                            "name": "get_current_time",
                            "content": time_response,
                        }
                    )
            except Exception:
                logger.exception("Failed to handle tool call: %s", getattr(tool_call, "id", "<unknown>"))
    else:
        logger.info("No tool calls were made by the model.")

    # Finalize conversation
    final_response = _api_call_with_retries(client.chat.completions.create, model=DEPLOYMENT, messages=messages)
    final_text = final_response.choices[0].message.content
    logger.info("Final model output received")
    # Append the final assistant message to the conversation and persist a copy
    logger.debug("Appending final assistant message to conversation history")
    messages.append({"role": "assistant", "content": final_text})

    try:
        convo_path = os.path.join(os.getcwd(), "time_agent_conversation.json")
        with open(convo_path, "w", encoding="utf-8") as f:
            json.dump({"messages": messages}, f, ensure_ascii=False, indent=2)
        logger.info("Conversation saved to %s", convo_path)
    except Exception:
        logger.debug("Failed to save conversation", exc_info=True)
    return final_text

if __name__ == "__main__":
    print(run_conversation())

# fetch, checkout default, merge feature, push
git fetch origin
git checkout Dreadwitdastacc-Ifawole
git pull origin Dreadwitdastacc-Ifawole
git merge --no-ff feat/cosmos-emulator-setup
# resolve conflicts if any, then:
git push origin Dreadwitdastacc-Ifawole

git fetch origin
git status -sb
git branch -vv
git log --oneline origin/Dreadwitdastacc-Ifawole..feat/cosmos-emulator-setup
