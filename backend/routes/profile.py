"""
GrowGov AI – Profile & AI Analysis Routes
"""

from fastapi import APIRouter, HTTPException
from models import ProfileAnalysisRequest, ProfileAnalysisResponse, EmployeeProfileUpdate

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("/")
def get_employee_profile():
    return {
        "id": "GOV-STAT-2021-089",
        "name": "Rahul Sharma",
        "email": "rahul.sharma@mospi.gov.in",
        "role": "Statistical Officer",
        "department": "Ministry of Statistics and Programme Implementation",
        "experience": "5 Years",
        "qualification": "M.Sc. Statistics",
        "responsibilities": "Large-scale survey data analysis, official quarterly GDP reports, statistical modeling for policy inputs",
        "skills": "Descriptive Statistics, Survey Sampling, MS Excel (Advanced), Basic Python, Report Writing",
        "previous_training": "iGOT Karmayogi Induction (2021), National Accounts Basics (2022)",
        "overall_competency": 78,
        "critical_gaps_count": 3
    }

@router.post("/analyze", response_model=ProfileAnalysisResponse)
def analyze_profile_with_ai(data: ProfileAnalysisRequest):
    # Simulated NLP parsing of responsibilities against MoSPI National Occupational Standards
    return ProfileAnalysisResponse(
        detected_role="Statistical Officer (MoSPI Group 'B' Gazetted)",
        major_tasks=[
            "Analyze Government Data",
            "Prepare Reports & Releases",
            "Use Statistical Tools & Sampling",
            "Support Policy Planning"
        ],
        required_competencies={
            "Statistical Analysis": 80.0,
            "Data Visualization": 80.0,
            "Digital Governance": 75.0,
            "Data Management": 75.0,
            "Communication": 80.0
        },
        current_competencies={
            "Statistical Analysis": 70.0,
            "Data Visualization": 40.0,
            "Digital Governance": 55.0,
            "Data Management": 65.0,
            "Communication": 80.0
        },
        potential_skill_gaps=[
            {
                "competency": "Data Visualization",
                "gap": 40.0,
                "priority": "Critical",
                "reason": "Official reporting role requires high Power BI & Tableau mastery; current profile lacks modern visual dashboard credentials."
            },
            {
                "competency": "Digital Governance",
                "gap": 20.0,
                "priority": "High",
                "reason": "Requires adherence to modern eOffice 7.0 and national cyber hygiene protocols."
            }
        ]
    )
