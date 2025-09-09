# Placify Resume-Job Matching Engine
# AI-driven resume analysis and job matching using NLP embeddings

import os
from typing import Dict, Any, List

try:
    from sentence_transformers import SentenceTransformer, util
except ImportError:
    SentenceTransformer = None
    util = None

# Load SBERT model (can be replaced with other embedding models)
MODEL_NAME = "all-MiniLM-L6-v2"
model = SentenceTransformer(MODEL_NAME) if SentenceTransformer else None


def extract_resume_skills_experience(resume: Dict[str, Any]) -> str:
    """
    Extracts and normalizes skills and experience from resume dict into a single string.
    """
    skills = ", ".join(resume.get("skills", []))
    experience = []
    for work in resume.get("workExperience", []):
        experience.append(f"{work.get('role', '')} at {work.get('company', '')}: {work.get('description', '')}")
    projects = []
    for proj in resume.get("projects", []):
        projects.append(f"{proj.get('title', '')}: {proj.get('description', '')}")
    education = []
    for edu in resume.get("education", []):
        education.append(f"{edu.get('degree', '')} at {edu.get('institution', '')}")
    summary = resume.get("summary", "")
    return ", ".join([summary, skills] + experience + projects + education)


def extract_job_description(job: Dict[str, Any]) -> str:
    """
    Normalizes job description, requirements, and responsibilities into a single string.
    """
    desc = job.get("description", "")
    requirements = ", ".join(job.get("requirements", []))
    responsibilities = ", ".join(job.get("responsibilities", []))
    title = job.get("title", "")
    domain = job.get("domain", "")
    return ", ".join([title, domain, desc, requirements, responsibilities])


def compute_resume_job_match_score(resume: Dict[str, Any], job: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes similarity score between resume and job description using NLP embeddings.
    Returns match score, missing/weak skills, and feedback.
    """
    resume_text = extract_resume_skills_experience(resume)
    job_text = extract_job_description(job)
    if not model:
        return {"matchScore": 0, "feedback": "NLP model not available", "missingSkills": [], "suggestions": []}
    resume_emb = model.encode(resume_text, convert_to_tensor=True)
    job_emb = model.encode(job_text, convert_to_tensor=True)
    similarity = util.pytorch_cos_sim(resume_emb, job_emb).item()
    match_score = int(similarity * 100)

    # Skill gap analysis
    resume_skills = set([s.lower() for s in resume.get("skills", [])])
    job_requirements = set([r.lower() for r in job.get("requirements", [])])
    missing_skills = list(job_requirements - resume_skills)
    weak_skills = [s for s in job_requirements if s not in resume_skills]

    suggestions = []
    if missing_skills:
        suggestions.append(f"Add or improve these skills: {', '.join(missing_skills)}")
    if match_score < 70:
        suggestions.append("Consider taking recommended courses or assessments to boost your profile.")
    suggestions.append("Optimize resume keywords and structure for ATS compliance.")

    feedback = f"Your resume matches {match_score}% with the job description."
    return {
        "matchScore": match_score,
        "missingSkills": missing_skills,
        "weakSkills": weak_skills,
        "suggestions": suggestions,
        "feedback": feedback
    }


def recommend_learning_modules(missing_skills: List[str]) -> List[str]:
    """
    Suggests learning modules or assessments based on missing skills.
    """
    modules = []
    for skill in missing_skills:
        modules.append(f"Take a {skill.title()} assessment or course to improve your chances.")
    return modules


def analyze_resume_job_match(resume: Dict[str, Any], job: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main entry point for backend to call for resume-job matching analysis.
    """
    match_result = compute_resume_job_match_score(resume, job)
    learning_recommendations = recommend_learning_modules(match_result.get("missingSkills", []))
    match_result["learningRecommendations"] = learning_recommendations
    return match_result

# Example usage:
# result = analyze_resume_job_match(resume_dict, job_dict)
# print(result)