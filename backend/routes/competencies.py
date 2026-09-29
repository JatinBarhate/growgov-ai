"""
GrowGov AI – Competencies & Skill Gap Routes
"""

from fastapi import APIRouter
from typing import List
from models import CompetencyResponse

router = APIRouter(prefix="/api/competencies", tags=["Competencies"])

COMPETENCIES_STORE = [
    {
        "id": "comp_1",
        "name": "Statistical Analysis",
        "category": "Core Technical",
        "current": 70.0,
        "required": 80.0,
        "gap": 10.0,
        "priority": "Medium"
    },
    {
        "id": "comp_2",
        "name": "Data Visualization",
        "category": "Technical & Delivery",
        "current": 40.0,
        "required": 80.0,
        "gap": 40.0,
        "priority": "Critical"
    },
    {
        "id": "comp_3",
        "name": "Digital Governance",
        "category": "Administrative",
        "current": 55.0,
        "required": 75.0,
        "gap": 20.0,
        "priority": "High"
    },
    {
        "id": "comp_4",
        "name": "Data Management",
        "category": "Technical",
        "current": 65.0,
        "required": 75.0,
        "gap": 10.0,
        "priority": "Medium"
    },
    {
        "id": "comp_5",
        "name": "Communication",
        "category": "Behavioral",
        "current": 80.0,
        "required": 80.0,
        "gap": 0.0,
        "priority": "No Gap"
    }
]

@router.get("/", response_model=List[CompetencyResponse])
def get_all_competencies():
    # Automatically recalculates gap = required - current
    for c in COMPETENCIES_STORE:
        c["gap"] = round(c["required"] - c["current"], 1)
        if c["gap"] >= 30:
            c["priority"] = "Critical"
        elif c["gap"] >= 20:
            c["priority"] = "High"
        elif c["gap"] > 0:
            c["priority"] = "Medium"
        else:
            c["priority"] = "No Gap"
    return COMPETENCIES_STORE

@router.get("/mapping")
def get_competency_mapping():
    return {
        "role": "Statistical Officer",
        "ministry": "Ministry of Statistics and Programme Implementation",
        "mappings": [
            {
                "task": "Analyze Government Data",
                "competency": "Data Analysis",
                "skills": ["Python", "Excel", "Statistics"]
            },
            {
                "task": "Prepare Reports",
                "competency": "Data Visualization",
                "skills": ["Power BI", "Tableau"]
            },
            {
                "task": "Use Statistical Tools",
                "competency": "Statistical Methods",
                "skills": ["Sampling", "Survey Methods"]
            },
            {
                "task": "Support Policy Planning",
                "competency": "Digital Governance",
                "skills": ["eOffice", "Data Security"]
            }
        ]
    }
