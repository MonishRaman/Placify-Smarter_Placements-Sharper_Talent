import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, Any, List

# Import our other modules
from .career_graph import CareerGraph
from .profile_vectorizer import Vectorizer
from .skill_gap_analyzer import get_skill_gap
from .llm_integrator import LLMIntegrator

class Pathfinder:
    def __init__(self, career_graph: CareerGraph, vectorizer: Vectorizer, llm: LLMIntegrator):
        self.graph = career_graph.get_graph()
        self.vectorizer = vectorizer
        self.llm = llm
        
        # Pre-compute and cache job role vectors on initialization
        self.role_vectors = self._precompute_role_vectors()

    def _precompute_role_vectors(self) -> Dict[str, np.ndarray]:
        """
        Generates and stores a vector for each role in the graph.
        """
        role_vectors = {}
        for node, data in self.graph.nodes(data=True):
            skills = list(data.get('skills', []))
            role_vectors[node] = self.vectorizer.vectorize_job_role(node, skills)
        return role_vectors

    def _find_closest_start_node(self, student_vector: np.ndarray) -> str:
        """
        Finds the "closest" job role in the graph to the student's
        profile vector using cosine similarity.
        """
        if not self.role_vectors:
            return None
        
        # Reshape student vector for pairwise comparison
        student_vector_2d = student_vector.reshape(1, -1)
        
        roles = list(self.role_vectors.keys())
        vectors = np.array(list(self.role_vectors.values()))
        
        # Calculate similarities
        similarities = cosine_similarity(student_vector_2d, vectors)
        
        # Get the role with the highest similarity
        closest_role_index = np.argmax(similarities)
        return roles[closest_role_index]

    def find_career_paths(self, student_profile: Dict[str, Any], num_paths: int = 2) -> List[Dict[str, Any]]:
        """
        Main logic to generate career path recommendations.
        """
        resume_text = student_profile.get("resume_text", "")
        student_skills = set(s.lower() for s in student_profile.get("skills", []))
        
        # 1. Vectorize student profile
        student_vector = self.vectorizer.vectorize_profile(resume_text, list(student_skills))
        
        # 2. Find the closest starting role
        start_node = self._find_closest_start_node(student_vector)
        if not start_node:
            return [] # Cannot proceed
            
        current_role_skills = self.graph.nodes[start_node].get('skills', set())

        # 3. Find all possible "next steps" (successors in the graph)
        possible_next_steps = list(self.graph.successors(start_node))
        
        if not possible_next_steps:
            return [{
                "path": [start_node],
                "skill_gap": [],
                "recommendation_text": "You are at a senior position with no predefined next steps in our current graph. Consider mentorship or specialized roles!"
            }]

        # 4. Calculate cost (skill gap) for each next step
        scored_steps = []
        for target_node in possible_next_steps:
            target_role_skills = self.graph.nodes[target_node].get('skills', set())
            
            skill_gap = get_skill_gap(current_role_skills, target_role_skills, student_skills)
            cost = len(skill_gap) # "cost" is the size of the skill gap
            
            scored_steps.append({
                "target": target_node,
                "cost": cost,
                "skill_gap": skill_gap
            })

        # 5. Sort steps by cost (lowest gap first) and take the top N
        sorted_steps = sorted(scored_steps, key=lambda x: x['cost'])
        top_steps = sorted_steps[:num_paths]
        
        # 6. Generate final recommendations
        recommendations = []
        for step in top_steps:
            target_role = step['target']
            skill_gap_list = step['skill_gap']
            
            # 7. Get AI-generated advice
            recommendation_text = self.llm.generate_recommendation(target_role, skill_gap_list)
            
            recommendations.append({
                "path": [start_node, target_role],
                "skill_gap": skill_gap_list,
                "recommendation_text": recommendation_text
            })
            
        return recommendations