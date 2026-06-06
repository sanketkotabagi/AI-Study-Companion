# 🤖 AI Study Companion

AI Study Companion is an AI-powered learning assistant that helps students interact with their study materials using Generative AI and Retrieval-Augmented Generation (RAG).

## 🚀 Features

* PDF Upload and Processing
* AI-powered Question Answering
* Automatic Summary Generation
* MCQ Quiz Generation
* Voice-based Question Input
* Student Login & Registration
* Retrieval-Augmented Generation (RAG)

---

## 🏗️ Architecture

PDF Upload → Text Extraction → Chunking → Embedding Generation → ChromaDB Vector Store → Retriever → Groq LLM → Response Generation

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML
* CSS

### Backend

* FastAPI
* Python

### AI Stack

* LangChain
* Groq API
* Llama 3.3 70B Versatile

### Vector Database

* ChromaDB

### Embedding Model

* HuggingFace Embeddings

---

## 📂 Project Structure

AI-Study-Companion

├── backend

│ ├── main.py

│ ├── rag

│ │ ├── loader.py

│ │ ├── embedder.py

│ │ ├── retriever.py

│ │ └── llm.py

│

├── frontend

│ ├── src

│ ├── public

│ └── package.json

│

└── README.md

---

## ⚙️ Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🎯 Future Enhancements

* Multi-PDF Support
* User-wise Chat History
* Cloud Deployment
* Dark/Light Theme
* Performance Analytics Dashboard
* Flashcard Generation

---

## 👨‍💻 Author

Sanket Kotabagi

AI & Machine Learning Engineer
