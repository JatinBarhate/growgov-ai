"""
GrowGov AI – AI MCQ Generator & Assessment Submission Routes
"""

from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from models import AssessmentSubmission, AssessmentResultResponse

router = APIRouter(prefix="/api/assessment", tags=["Assessment"])

@router.post("/generate-mcqs")
async def generate_mcqs(
    competency: str = Form("Data Visualization"),
    topic: str = Form("Chart Selection & Executive Dashboards"),
    difficulty: str = Form("Medium"),
    count: int = Form(10),
    file: Optional[UploadFile] = File(None)
):
    # Simulated generation based on document vectors
    return {
        "status": "success",
        "message": f"Generated {count} adaptive questions for {competency} on topic '{topic}'",
        "questions_count": count,
        "alignment": "Bloom's Taxonomy Level 4 (Analyze & Evaluate)",
        "source_document": file.filename if file else "MoSPI_Data_Visualization_Guidelines_v3.pdf"
    }

@router.post("/submit", response_model=AssessmentResultResponse)
def submit_assessment(sub: AssessmentSubmission):
    # Core Demo Logic: 8/10 score triggers leap from 40% -> 62%
    score = sub.auto_demo_score if sub.auto_demo_score is not None else 8
    total = 10
    accuracy = round((score / total) * 100, 1)

    previous_competency = 40.0
    updated_competency = 62.0
    gain = updated_competency - previous_competency

    return AssessmentResultResponse(
        score=score,
        total=total,
        accuracy=accuracy,
        competency="Data Visualization",
        previous_competency=previous_competency,
        updated_competency=updated_competency,
        gain=gain,
        strong_topics=[
            "Chart Selection Principles",
            "Public Policy Visualizations",
            "Dashboard Layout Prioritization"
        ],
        weak_topics=[
            "Data-Ink Ratio Nuances",
            "Outlier Scaling in Survey Maps"
        ],
        recommended_next_step="Continue with Advanced Data Visualization Level 2 to reach your 80% benchmark."
    )
