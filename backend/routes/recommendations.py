"""
GrowGov AI – AI Recommendations Routes
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.get("/")
def get_recommendations():
    return [
        {
            "id": "rec_1",
            "course_name": "Advanced Data Visualization & Ministry Dashboards",
            "competency": "Data Visualization",
            "current_level": 40.0,
            "target_level": 80.0,
            "priority": "Critical",
            "duration": "6 Hours",
            "difficulty": "Intermediate to Advanced",
            "recommended_module": "Module 3: Transforming Complex Government Datasets into Executive Dashboards with Power BI & Tableau",
            "why_recommended": "Your current Data Visualization competency is 40%, while your job role requires 80%. Competency Gap: 40%. Priority: Critical."
        },
        {
            "id": "rec_2",
            "course_name": "Digital Governance & eOffice 7.0 Security Workflows",
            "competency": "Digital Governance",
            "current_level": 55.0,
            "target_level": 75.0,
            "priority": "High",
            "duration": "4.5 Hours",
            "difficulty": "Intermediate",
            "recommended_module": "Module 2: Inter-Ministerial File Routing & Digital Signatures",
            "why_recommended": "Your current Digital Governance competency is 55%, while your role benchmark is 75%. Competency Gap: 20%. Priority: High."
        }
    ]
