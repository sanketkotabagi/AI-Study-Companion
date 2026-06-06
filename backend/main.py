from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from rag.loader import load_pdf
from rag.embedder import create_vector_store
from rag.retriever import get_retriever
from rag.llm import generate_answer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

@app.get("/")
def home():

    return {
        "message": "AI Study Companion Running Successfully"
    }


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    try:

        file_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        documents = load_pdf(file_path)

        print("DOCUMENTS LOADED:", len(documents))

        chunks = create_vector_store(documents)

        print("CHUNKS CREATED:", chunks)

        return {
            "message": "PDF processed successfully",
            "chunks_created": chunks
        }

    except Exception as e:

        return {
            "error": str(e)
        }


@app.get("/ask")
def ask_question(question: str):

    try:

        retriever = get_retriever()

        docs = retriever.invoke(question)

        print("DOCS FOUND:", len(docs))

        context = "\n".join(
            [doc.page_content for doc in docs]
        )

        if not context.strip():

            return {
                "answer": "Information not found in uploaded notes."
            }

        answer = generate_answer(
            question,
            context
        )

        return {
            "question": question,
            "answer": answer
        }

    except Exception as e:

        return {
            "error": str(e)
        }


@app.get("/quiz")
def generate_quiz():

    try:

        retriever = get_retriever()

        docs = retriever.invoke(
            "Generate quiz from uploaded notes"
        )

        context = "\n".join(
            [doc.page_content for doc in docs]
        )

        if not context.strip():

            return {
                "quiz": "Please upload notes first."
            }

        prompt = f"""
You are an expert quiz generator.

Generate EXACTLY 5 Multiple Choice Questions from the uploaded notes.

STRICT RULES:

1. Every question MUST contain a complete question sentence.
2. Do NOT leave the question text empty.
3. Each question must have exactly 4 options.
4. Options must be meaningful.
5. Mention only option letter in Correct Answer.
6. Use ONLY information from the uploaded notes.
7. Do NOT generate explanations.

OUTPUT FORMAT:

Question 1:
<question text>

A) Option A
B) Option B
C) Option C
D) Option D

Correct Answer: A

Question 2:
<question text>

A) Option A
B) Option B
C) Option C
D) Option D

Correct Answer: B

Question 3:
<question text>

A) Option A
B) Option B
C) Option C
D) Option D

Correct Answer: C

Question 4:
<question text>

A) Option A
B) Option B
C) Option C
D) Option D

Correct Answer: D

Question 5:
<question text>

A) Option A
B) Option B
C) Option C
D) Option D

Correct Answer: A

Notes:
{context}
"""

        quiz = generate_answer(
            prompt,
            context
        )

        return {
            "quiz": quiz
        }

    except Exception as e:

        return {
            "error": str(e)
        }


@app.get("/summary")
def generate_summary():

    try:

        retriever = get_retriever()

        docs = retriever.invoke(
            "Summarize uploaded notes"
        )

        context = "\n".join(
            [doc.page_content for doc in docs]
        )

        if not context.strip():

            return {
                "summary": "Please upload notes first."
            }

        prompt = f"""
Create a concise study summary from the notes.

Rules:
1. Use only the notes.
2. Give important points in bullet format.
3. Keep it easy to understand.
4. Maximum 10 bullet points.

Notes:
{context}
"""

        summary = generate_answer(
            prompt,
            context
        )

        return {
            "summary": summary
        }

    except Exception as e:

        return {
            "error": str(e)
        }