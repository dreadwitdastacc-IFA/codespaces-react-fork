"""Model client abstraction.

- If `MODEL_ENDPOINT` is set, POSTs {"prompt": ...} to that endpoint with `Authorization: Bearer <MODEL_API_KEY>`.
- Otherwise, provides a simple mock response for local offline use.
"""
import os
import requests
import json

class ModelClient:
    def __init__(self, endpoint=None, api_key=None, timeout=15):
        self.endpoint = endpoint or os.getenv('MODEL_ENDPOINT')
        self.api_key = api_key or os.getenv('MODEL_API_KEY')
        self.timeout = timeout

    def query(self, prompt, max_tokens=512):
        if not self.endpoint:
            # Fallback/mock: return the prompt echo or simple structured response
            return {"text": f"[mock] Received prompt: {prompt[:200]}"}

        payload = {
            "prompt": prompt,
            "max_tokens": max_tokens
        }
        headers = {
            "Content-Type": "application/json"
        }
        if self.api_key:
            headers['Authorization'] = f"Bearer {self.api_key}"

        try:
            resp = requests.post(self.endpoint, json=payload, headers=headers, timeout=self.timeout)
            resp.raise_for_status()
            # Try to parse JSON
            data = resp.json()
            # Expect provider to return {'text': '...'} or similar
            return data
        except requests.RequestException as e:
            return {"error": str(e)}
        except json.JSONDecodeError:
            return {"error": "Invalid JSON response from model endpoint"}
