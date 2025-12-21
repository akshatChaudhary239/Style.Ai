from dotenv import load_dotenv
import os

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.ai import router as ai_router
app = FastAPI(title="Custom AI Backend")

# Allow frontend to call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # change to your domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend running"}

app.include_router(ai_router, prefix="/ai")

from app.db.supabase import supabase_admin

def test_db():
    res = supabase_admin.table("seller_profile").select("id").limit(1).execute()
    print(res)

