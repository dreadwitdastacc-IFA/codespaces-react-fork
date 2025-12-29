Cooking AI Agent (Console)

Overview
- Interactive console application that supports recipe search and ingredient extraction.
- Designed to call a hosted model endpoint (configure via env vars) or run offline with a local sample dataset.

Structure
- `src/model_client.py` — abstraction to call a model endpoint (GitHub-hosted models supported via env).
- `src/recipes.py` — small in-memory recipe dataset for testing.
- `src/agent.py` — high-level functions: `search_recipes`, `extract_ingredients` that use the model client.
- `src/cli.py` — interactive console REPL.

Setup
1. Create a virtualenv and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. (Optional) Configure a model endpoint. The app reads these environment variables:
- `MODEL_ENDPOINT` — HTTP POST endpoint for your GitHub-hosted model or other model service
- `MODEL_API_KEY` — API key for the model endpoint

You can also run the app without configuring a model; it will use a simple local fallback.

Run

```bash
python src/cli.py
```

Usage (sample commands inside the CLI)
- `search <query>` — search recipes by keyword
- `show <id>` — show a recipe by id
- `extract <id>` — extract ingredients from a recipe using the model (or fallback)
- `help` — show commands
- `quit` — exit

Notes
- To integrate Microsoft/GitHub-specific models, supply a compatible `MODEL_ENDPOINT` and `MODEL_API_KEY` and adapt `src/model_client.py` to the provider's request format.
- If you want an Agent Framework integration, install the preview package: `pip install agent-framework-azure-ai --pre` and let me scaffold an Agent-based orchestration.
