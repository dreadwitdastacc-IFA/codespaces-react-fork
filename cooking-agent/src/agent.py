"""High-level agent functions: search and ingredient extraction."""
from model_client import ModelClient
from recipes import RECIPES
import re

client = ModelClient()

def search_recipes(query, top_n=5):
    """Simple local search + optional model ranking.

    - First, filter local recipes by keyword match.
    - If model is available, ask it to rank or expand results.
    """
    q = query.lower()
    matches = [r for r in RECIPES if q in r['title'].lower() or any(q in ing.lower() for ing in r['ingredients'])]

    # If no endpoint, return local matches
    if not client.endpoint:
        return matches[:top_n]

    # Ask model to rank matched recipes (pass titles + short descriptions)
    items_text = "\n".join([f"{r['id']}: {r['title']} - Ingredients: {', '.join(r['ingredients'])}" for r in matches])
    prompt = f"Rank the following recipes by relevance to the query '{query}':\n\n{items_text}\n\nReturn a JSON array of recipe ids in order."
    resp = client.query(prompt)
    if 'error' in resp:
        return matches[:top_n]

    # Try to extract JSON array from response
    text = resp.get('text') or resp.get('result') or str(resp)
    ids = re.findall(r'\"(r\d)\"|\b(r\d)\b', text)
    # ids is list of tuples; flatten
    flat = [a or b for a,b in ids]
    ordered = [next((r for r in matches if r['id']==rid), None) for rid in flat]
    ordered = [r for r in ordered if r]
    # Fill remainder
    for r in matches:
        if r not in ordered:
            ordered.append(r)
    return ordered[:top_n]


def extract_ingredients(recipe_text):
    """Ask model to extract ingredients list from a raw recipe text.
    Falls back to heuristic extraction.
    """
    prompt = f"Extract a JSON array of ingredients from the following recipe text:\n\n{recipe_text}\n\nRespond only with valid JSON array of strings."
    resp = client.query(prompt)
    if 'error' in resp:
        # fallback: naive line-based extraction
        lines = recipe_text.splitlines()
        candidates = [l.strip('-•* ').strip() for l in lines if re.search(r'\b\d|cup|tbsp|tsp|slice|g|kg|ml|pinch', l, re.I)]
        return candidates

    text = resp.get('text') or resp.get('result') or str(resp)
    # Try parse JSON in response
    try:
        import json
        parsed = json.loads(text)
        if isinstance(parsed, list):
            return parsed
    except Exception:
        # try to extract quoted strings
        items = re.findall(r'"([^"]+)"|\'([^']+)\'', text)
        flat = [a or b for a,b in items]
        if flat:
            return flat

    # Last fallback: naive extraction
    lines = recipe_text.splitlines()
    candidates = [l.strip('-•* ').strip() for l in lines if re.search(r'\b\d|cup|tbsp|tsp|slice|g|kg|ml|pinch', l, re.I)]
    return candidates
