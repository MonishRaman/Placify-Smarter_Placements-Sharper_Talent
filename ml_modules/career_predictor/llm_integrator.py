import google.generativeai as genai
import os
from dotenv import load_dotenv
from typing import List

# Load API key from .env file
load_dotenv()

class LLMIntegrator:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        
        # Configure with the API key
        genai.configure(api_key=api_key)
        
        # Get available models
        try:
            models = genai.list_models()
            available_models = [m.name for m in models]
            print(f"Available models: {available_models}")
            
            # Find a suitable Gemini model
            gemini_models = [m for m in available_models if "gemini" in m.lower()]
            if gemini_models:
                model_name = gemini_models[0]
                print(f"Using model: {model_name}")
            else:
                # Default to a standard name if we can't get the list
                model_name = "models/gemini-1.5-pro"
                print(f"No Gemini models found, defaulting to: {model_name}")
        except Exception as e:
            print(f"Error listing models: {e}")
            model_name = "models/gemini-1.5-pro"
            print(f"Error occurred, defaulting to: {model_name}")
            
        self.model = genai.GenerativeModel(model_name)

    def generate_recommendation(self, target_role: str, skill_gap: List[str]) -> str:
        """
        Generates a personalized learning plan using the LLM.
        """
        if not skill_gap:
            return f"You already have a strong skill set for the {target_role} role. Focus on building projects and gaining experience."

        skills_str = ", ".join(skill_gap)
        
        prompt = f"""
        Act as an expert career coach in the software industry. 
        A student is trying to move into a '{target_role}' role and has the following skill gaps: {skills_str}.

        Please provide a concise, actionable recommendation in 3 parts:
        1.  **Narrative:** A brief, encouraging paragraph (2-3 sentences) explaining why these skills are important for the '{target_role}' role.
        2.  **Project Ideas:** 1-2 small project ideas that would help them learn and demonstrate these skills.
        3.  **Key Resources:** 1-2 high-quality online resources (e.g., a specific documentation page, a well-known tutorial, or a platform) to learn these skills.

        Format the response clearly in markdown.
        """
        
        try:
            print("Generating recommendation with prompt:", prompt[:100] + "...")
            
            # Create generation config with safety settings turned off for testing
            generation_config = {
                "temperature": 0.7,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 1024,
            }
            
            safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_NONE"
                },
            ]
            
            response = self.model.generate_content(
                contents=prompt,
                generation_config=generation_config,
                safety_settings=safety_settings
            )
            
            if hasattr(response, 'text'):
                return response.text
            elif hasattr(response, 'parts'):
                return ''.join(part.text for part in response.parts)
            else:
                print("Unexpected response format:", response)
                return "Error generating recommendation: Unexpected response format"
                
        except Exception as e:
            print(f"Error generating LLM content: {e}")
            return f"Error generating recommendation. Details: {str(e)}"