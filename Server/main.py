from fastapi import FastAPI
import ollama
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

origins = [
    "http://localhost:3000",  # Frontend URL
    "http://127.0.0.1:8000",
    "https://yourfrontend.com",  # Production frontend URL
    "*",  # Allow all origins (Use cautiously in production)
]

# ✅ Correct syntax for adding middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Define allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.post("/generate")
def genrate(prompt : str):
    response = ollama.chat(model="llama3.2:1b", messages=[{"role": "user", "content" : prompt}])
    return {"content" : response['message']['content'], "role" : "assistant"}