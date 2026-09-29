"""
GrowGov AI – Admin & Ministry Analytics Routes
"""

from fastapi import APIRouter

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.get("/stats")
def get_admin_dashboard_stats():
    return {
        "total_employees": 1420,
        "departments_count": 18,
        "critical_skill_gaps": 84,
        "active_training_programs": 42,
        "assessments_completed": 3890,
        "departments": [
            {"name": "MoSPI", "total": 320, "critical_gaps": 18, "high_gaps": 42},
            {"name": "Dept of Economic Affairs", "total": 240, "critical_gaps": 14, "high_gaps": 28},
            {"name": "Dept of Revenue", "total": 410, "critical_gaps": 22, "high_gaps": 54},
            {"name": "NITI Aayog", "total": 180, "critical_gaps": 8, "high_gaps": 18},
            {"name": "DoPT", "total": 270, "critical_gaps": 22, "high_gaps": 36}
        ]
    }

@router.get("/employees")
def get_cadre_employees():
    return [
        {
            "id": "GOV-STAT-2021-089",
            "name": "Rahul Sharma",
            "department": "MoSPI",
            "role": "Statistical Officer",
            "competency_score": 78,
            "critical_gaps": 3,
            "training_progress": 60,
            "status": "Active"
        },
        {
            "id": "GOV-REV-2019-142",
            "name": "Priya Patel",
            "department": "Dept of Revenue",
            "role": "Tax Officer",
            "competency_score": 62,
            "critical_gaps": 4,
            "training_progress": 35,
            "status": "Under Review"
        },
        {
            "id": "GOV-STAT-2018-044",
            "name": "Amit Verma",
            "department": "MoSPI",
            "role": "Senior Investigator",
            "competency_score": 84,
            "critical_gaps": 1,
            "training_progress": 90,
            "status": "Certified"
        }
    ]
