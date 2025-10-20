from typing import Set, List

def get_skill_gap(current_role_skills: Set[str], 
                  target_role_skills: Set[str], 
                  student_skills: Set[str]) -> List[str]:
    """
    Calculates the skills a student needs to acquire to move from a
    current role to a target role.
    
    The gap includes:
    1. Skills from the target role the student doesn't have.
    2. Foundational skills from the current role the student is missing.
    """
    
    # Normalize all skills to lowercase for accurate comparison
    current_role_skills = {s.lower() for s in current_role_skills}
    target_role_skills = {s.lower() for s in target_role_skills}
    student_skills = {s.lower() for s in student_skills}

    # Skills required for the next step (target + any missing from current)
    foundational_skills_needed = current_role_skills - student_skills
    future_skills_needed = target_role_skills - student_skills
    
    total_gap = foundational_skills_needed.union(future_skills_needed)
    
    return sorted(list(total_gap))