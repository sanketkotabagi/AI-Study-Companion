from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
import shutil
import os

DB_PATH = "chroma_db"

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def create_vector_store(documents):

    if os.path.exists(DB_PATH):
        shutil.rmtree(DB_PATH)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    docs = splitter.split_documents(documents)

    vector_db = Chroma.from_documents(
        documents=docs,
        embedding=embedding_model,
        persist_directory=DB_PATH
    )

    vector_db.persist()

    print("NEW VECTOR DB CREATED")

    return len(docs)