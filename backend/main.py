"""
GrowGov AI – FastAPI Application Entry Point
SIH 2026 Prototype
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import profile, competencies, recommendations, assessment, admin

app = FastAPI(
    title="GrowGov AI – Backend API",
    description="AI-Enabled Competency Development Platform for iGOT Karmayogi (SIH 2026)",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(profile.router)
app.include_router(competencies.router)
app.include_router(recommendations.router)
app.include_router(assessment.router)
app.include_router(admin.router)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "GrowGov AI API",
        "ecosystem": "iGOT Karmayogi / SIH 2026",
        "database": "PostgreSQL (with SQLite fallback active)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
