"""
GrowGov AI – Database ORM Models & Pydantic Data Schemas
SIH 2026 Prototype
"""

from typing import List, Optional
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from pydantic import BaseModel, EmailStr
from database import Base

# ============================================================================
# SQLAlchemy ORM Models
# ============================================================================

class EmployeeModel(Base):
    __tablename__ = "employees"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    role = Column(String(100), nullable=False)
    department = Column(String(150), nullable=False)
    experience = Column(String(50))
    qualification = Column(String(100))
    responsibilities = Column(Text)
    skills = Column(Text)
    previous_training = Column(Text)
    overall_competency = Column(Float, default=78.0)
    critical_gaps_count = Column(Integer, default=3)


class CompetencyModel(Base):
    __tablename__ = "competencies"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    current_level = Column(Float, nullable=False)
    required_level = Column(Float, nullable=False)
    gap = Column(Float, nullable=False)
    priority = Column(String(30), nullable=False)


class AssessmentResultModel(Base):
    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(String(50), nullable=False)
    competency = Column(String(100), nullable=False)
    score = Column(Integer, nullable=False)
    total = Column(Integer, nullable=False)
    accuracy = Column(Float, nullable=False)
    previous_competency = Column(Float, nullable=False)
    updated_competency = Column(Float, nullable=False)
    gain = Column(Float, nullable=False)


# ============================================================================
# Pydantic Schemas
# ============================================================================

class EmployeeProfileUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = None
    experience: Optional[str] = None
    qualification: Optional[str] = None
    responsibilities: Optional[str] = None
    skills: Optional[str] = None
    previous_training: Optional[str] = None


class ProfileAnalysisRequest(BaseModel):
    name: str
    department: str
    role: str
    responsibilities: str
    skills: str


class ProfileAnalysisResponse(BaseModel):
    detected_role: str
    major_tasks: List[str]
    required_competencies: dict
    current_competencies: dict
    potential_skill_gaps: List[dict]


class CompetencyResponse(BaseModel):
    id: str
    name: str
    category: str
    current: float
    required: float
    gap: float
    priority: str


class AssessmentSubmission(BaseModel):
    competency_id: str
    answers: dict
    auto_demo_score: Optional[int] = None


class AssessmentResultResponse(BaseModel):
    score: int
    total: int
    accuracy: float
    competency: str
    previous_competency: float
    updated_competency: float
    gain: float
    strong_topics: List[str]
    weak_topics: List[str]
    recommended_next_step: str
