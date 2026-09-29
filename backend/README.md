# GrowGov AI – Backend (FastAPI & PostgreSQL)

Smart India Hackathon 2026 | AI-Enabled Competency Development Platform for iGOT Karmayogi

## Architecture Overview
The backend is structured into modular domain routers matching the Karmayogi FRAC (Framework for Roles, Activities and Competencies) specification:

- `routes/profile.py` — Employee profile extraction & AI task-vector parsing
- `routes/competencies.py` — Role benchmarks, competency mapping, gap calculations (`Gap = Required - Current`)
- `routes/recommendations.py` — Priority-weighted course recommendations with explicit rationale ("Why this is recommended")
- `routes/assessment.py` — Bloom's Taxonomy AI MCQ generation & adaptive test evaluation
- `routes/admin.py` — Cadre controller analytics, ministry department benchmarks, and officer registries

## Database Configuration
Supports **PostgreSQL** by default, with an automatic fallback to local SQLite for zero-configuration hackathon evaluation.

To connect your own PostgreSQL instance, set the `DATABASE_URL` environment variable:
```bash
export DATABASE_URL="postgresql://username:password@localhost:5432/growgov"
```

## Running the Backend
1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the development server:
```bash
uvicorn main:app --reload --port 8000
```

3. Explore interactive Swagger API documentation:
```
http://localhost:8000/docs
```
