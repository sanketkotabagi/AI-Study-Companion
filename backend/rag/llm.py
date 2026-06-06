from groq import Groq
import os

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def generate_answer(question, context):

    prompt = f"""
You are an AI Study Assistant.

STRICT RULES:

1. Answer ONLY using the provided context.
2. Do NOT use your own knowledge.
3. If the answer is not present in the context, reply:
   "Information not found in uploaded notes."
4. Generate quiz questions ONLY from the context.

Context:
{context}

Question:
{question}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content