import json
from google import genai
from google.genai import types
import re


def deepseek(prompt: str) -> str:
    from ollama import chat
    response = chat(
        model="deepseek-r1:8b",
        messages=[{"role": "user", "content": prompt}]
    )
    return safe_json_parse(response.message.content)

def gemini(prompt: str) -> str:
    client = genai.Client(api_key="YOUR_API_KEY")    
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt]
        )
        return response.text.strip()
    except Exception as e:
        print("[ERROR] LLM call failed:", e)
        return ""
    
def safe_json_parse(text):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    try:
        json_pattern = re.compile(r'{.*}', re.DOTALL)
        match = json_pattern.search(text)
        if match:
            json_str = match.group()
            return json_str
    except Exception:
        print("[ERROR] Failed to extract JSON from text:", text)

    return {}





"""
    try:
        # Strip markdown-style code blocks if present
        if text.strip().startswith("```json"):
            text = text.strip().split("```json")[1].split("```", 1)[0].strip()
        elif text.strip().startswith("```"):
            text = text.strip().split("```", 1)[1].strip()
        return json.loads(text)
    except json.JSONDecodeError as e:
        print("[ERROR] Failed to parse JSON:", e)
        print("[RAW RESPONSE]", text)
        return {}
"""
        
"""


        
"""