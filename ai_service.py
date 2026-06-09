from google import genai
from google.genai import types

from config import GEMINI_API_KEY
import json


client = genai.Client(
    api_key=GEMINI_API_KEY
)


def analyze_meal_image(
    image: bytes,
    mime_type: str,
    user_prompt: str | None = None
):

    prompt = f"""
Analyze this meal image.

User information:
{user_prompt}

Rules:
1. If the user provides quantities, trust them.
2. Estimate quantities only when missing.
3. Return ONLY valid JSON.
4. Return ONLY raw JSON.
5. Do NOT use markdown.
6. Do NOT wrap in ```json blocks.
7. Use correct English spelling.
8. Use generic food names.
9. Never use brand names.
10. Prefer singular names.
- Examples:
    chiken → chicken
    eggs → egg
    biriyani → biryani rice
Example:

{{
    "foods": [
        {{
            "name": "rice",
            "quantity": 150,
            "unit": "g"
        }}
    ]
}}
"""

    image_part = types.Part.from_bytes(
        data=image,
        mime_type=mime_type
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            types.Part.from_text(text=prompt),
            image_part
        ]
    )
    text=response.text
    text = text.replace("```json", "")
    text = text.replace("```", "")

    return json.loads(text)
