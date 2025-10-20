from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List

class Vectorizer:
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        """
        Initializes the vectorizer, loading the sentence-transformer model.
        """
        try:
            self.model = SentenceTransformer(model_name)
        except Exception as e:
            print(f"Error loading SentenceTransformer model: {e}")
            # Fallback or error handling
            self.model = None

    def vectorize_profile(self, resume_text: str, skill_tags: List[str]) -> np.ndarray:
        """
        Combines resume text and skill tags into a single string and
        computes its vector embedding.
        """
        if not self.model:
            raise Exception("Vectorizer model not loaded.")
            
        # Combine inputs into a representative string
        skills_str = " ".join(skill_tags)
        combined_text = f"SKILLS: {skills_str}. RESUME: {resume_text}"
        
        # Create the embedding
        vector = self.model.encode(combined_text, convert_to_numpy=True)
        return vector

    def vectorize_job_role(self, job_title: str, core_skills: List[str]) -> np.ndarray:
        """
        Creates a vector representation for a job role.
        """
        if not self.model:
            raise Exception("Vectorizer model not loaded.")
            
        skills_str = " ".join(core_skills)
        combined_text = f"Job Title: {job_title}. Core Skills: {skills_str}."
        
        vector = self.model.encode(combined_text, convert_to_numpy=True)
        return vector