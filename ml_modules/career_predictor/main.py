from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

# Import our modules
from .career_graph import CareerGraph
from .profile_vectorizer import Vectorizer
from .llm_integrator import LLMIntegrator
from .pathfinder import Pathfinder

# --- Pydantic Models for Request and Response ---

class StudentRequest(BaseModel):
    student_id: str

class CareerPath(BaseModel):
    path: List[str]
    skill_gap: List[str]
    recommendation_text: str

class PredictionResponse(BaseModel):
    student_id: str
    predicted_current_role: str
    potential_paths: List[CareerPath]

# --- Global Initialization ---
# Load models once on startup
try:
    app = FastAPI(title="Career Path Predictor")
    
    career_graph = CareerGraph()
    vectorizer = Vectorizer()
    llm = LLMIntegrator()
    pathfinder = Pathfinder(career_graph, vectorizer, llm)
    
except Exception as e:
    # Handle model loading errors
    print(f"FATAL: Could not initialize models. {e}")
    # A real app would have better error handling here
    raise e


# --- Mock Database Function ---
def get_student_data(student_id: str) -> Dict[str, Any]:
    """
    Mock function to simulate fetching student data from the main database.
    """
    print(f"Fetching data for student: {student_id}")
    # In a real app, this would be an API call or DB query
    #
    # Mock data for demonstration:
    if student_id == "student123":
        return {
            "resume_text": "Experienced in building web applications with React and JavaScript. Created a personal blog and a to-do list app. Eager to learn backend technologies.",
            "skills": ["JavaScript", "React", "HTML", "CSS", "Git"]
        }
    elif student_id == "student456":
         return {
            "resume_text": "Completed coursework in Data Structures and Algorithms. Built a command-line application with Python and used SQL for a class project.",
            "skills": ["Python", "SQL", "Git", "C++"]
        }
    else:
        # Default mock
        return {
            "resume_text": "Student at University, studying Computer Science. Basic knowledge of Python.",
            "skills": ["Python", "Problem Solving"]
        }


# --- API Endpoint ---

@app.post("/predict-career-path", response_model=PredictionResponse)
async def predict_career_path(request: StudentRequest):
    """
    Analyzes a student's profile and predicts 2-3 high-potential
    career paths.
    """
    try:
        # 1. Fetch student data
        student_profile = get_student_data(request.student_id)
        if not student_profile:
            raise HTTPException(status_code=404, detail="Student not found")

        # 2. Run the pathfinder
        recommendations = pathfinder.find_career_paths(student_profile, num_paths=2)
        
        if not recommendations:
            raise HTTPException(status_code=500, detail="Could not generate recommendations.")

        # 3. Format and return the response
        # The 'predicted_current_role' is the first item in the *first* path.
        predicted_role = recommendations[0]["path"][0] if recommendations else "Unknown"
        
        return PredictionResponse(
            student_id=request.student_id,
            predicted_current_role=predicted_role,
            potential_paths=recommendations
        )
        
    except Exception as e:
        print(f"Error in /predict-career-path: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}